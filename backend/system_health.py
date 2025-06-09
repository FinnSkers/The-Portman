from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from database import engine, SessionLocal
import os
import requests
import psutil
import datetime
import json
import socket
from pathlib import Path

router = APIRouter(prefix="/system", tags=["system"])

@router.get("/status")
def system_status():
    """Comprehensive system health status"""
    health_data = {
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "uptime": get_system_uptime(),
        "database": check_database_health(),
        "filesystem": check_filesystem_health(),
        "memory": check_memory_usage(),
        "disk": check_disk_usage(),
        "network": check_network_connectivity(),
        "services": check_services_health(),
        "environment": check_environment_vars(),
        "dependencies": check_dependencies()
    }
    
    # Overall status based on critical components
    critical_issues = []
    if health_data["database"]["status"] != "ok":
        critical_issues.append("database")
    if health_data["filesystem"]["status"] != "ok":
        critical_issues.append("filesystem")
    if health_data["memory"]["usage_percent"] > 90:
        critical_issues.append("memory")
    if health_data["disk"]["usage_percent"] > 95:
        critical_issues.append("disk")
    
    if critical_issues:
        health_data["status"] = "warning" if len(critical_issues) == 1 else "error"
        health_data["issues"] = critical_issues
    
    return health_data

def get_system_uptime():
    """Get system uptime information"""
    try:
        boot_time = psutil.boot_time()
        uptime_seconds = datetime.datetime.now().timestamp() - boot_time
        uptime_hours = uptime_seconds / 3600
        return {
            "boot_time": datetime.datetime.fromtimestamp(boot_time).isoformat(),
            "uptime_hours": round(uptime_hours, 2),
            "uptime_days": round(uptime_hours / 24, 2)
        }
    except Exception as e:
        return {"error": str(e)}

def check_database_health():
    """Check database connection and performance"""
    try:
        start_time = datetime.datetime.now()
        with engine.connect() as conn:
            # Test basic connection
            conn.execute(text("SELECT 1"))
            
            # Test user table exists and is accessible
            result = conn.execute(text("SELECT COUNT(*) FROM users")).fetchone()
            user_count = result[0] if result else 0
            
        response_time = (datetime.datetime.now() - start_time).total_seconds() * 1000
        
        return {
            "status": "ok",
            "response_time_ms": round(response_time, 2),
            "user_count": user_count,
            "engine_info": str(engine.url)
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "engine_info": str(engine.url) if engine else "No engine"
        }

def check_filesystem_health():
    """Check filesystem read/write permissions"""
    try:
        base_dir = Path(__file__).parent
        test_dirs = [
            base_dir / "uploaded_cvs",
            base_dir / "generated_resumes", 
            base_dir / "generated_portfolios",
            base_dir / "__pycache__"
        ]
        
        dir_status = {}
        for test_dir in test_dirs:
            try:
                test_dir.mkdir(exist_ok=True)
                test_file = test_dir / f"health_test_{datetime.datetime.now().timestamp()}.txt"
                test_file.write_text("health check")
                test_file.unlink()
                dir_status[str(test_dir.name)] = "ok"
            except Exception as e:
                dir_status[str(test_dir.name)] = f"error: {str(e)}"
        
        return {
            "status": "ok" if all(status == "ok" for status in dir_status.values()) else "error",
            "directories": dir_status
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

def check_memory_usage():
    """Check system memory usage"""
    try:
        memory = psutil.virtual_memory()
        return {
            "total_gb": round(memory.total / (1024**3), 2),
            "available_gb": round(memory.available / (1024**3), 2),
            "used_gb": round(memory.used / (1024**3), 2),
            "usage_percent": memory.percent,
            "status": "ok" if memory.percent < 85 else "warning" if memory.percent < 95 else "critical"
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

def check_disk_usage():
    """Check disk usage for the application directory"""
    try:
        app_path = Path(__file__).parent.parent
        disk_usage = psutil.disk_usage(str(app_path))
        usage_percent = (disk_usage.used / disk_usage.total) * 100
        
        return {
            "total_gb": round(disk_usage.total / (1024**3), 2),
            "used_gb": round(disk_usage.used / (1024**3), 2),
            "free_gb": round(disk_usage.free / (1024**3), 2),
            "usage_percent": round(usage_percent, 2),
            "status": "ok" if usage_percent < 80 else "warning" if usage_percent < 90 else "critical"
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

def check_network_connectivity():
    """Check network connectivity"""
    try:
        # Test if we can bind to the application port
        test_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        test_socket.settimeout(1)
        result = test_socket.connect_ex(('127.0.0.1', int(os.getenv('PORT', '8000'))))
        test_socket.close()
        
        port_available = result != 0  # 0 means connection successful (port in use)
        
        return {
            "status": "ok" if not port_available else "warning",
            "port": int(os.getenv('PORT', '8000')),
            "localhost_accessible": not port_available,
            "message": "Server is running" if not port_available else "Port appears to be available"
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

def check_services_health():
    """Check health of individual services/modules"""
    services = {}
    
    # Check if core modules can be imported
    modules_to_check = ['cv', 'portfolio', 'ats_resume', 'users', 'analytics']
    
    for module_name in modules_to_check:
        try:
            __import__(module_name)
            services[module_name] = {"status": "ok", "importable": True}
        except ImportError as e:
            services[module_name] = {"status": "error", "importable": False, "error": str(e)}
        except Exception as e:
            services[module_name] = {"status": "warning", "importable": True, "error": str(e)}
    
    return services

def check_environment_vars():
    """Check critical environment variables"""
    critical_vars = ['DATABASE_URL', 'SECRET_KEY']
    optional_vars = ['PORT', 'CORS_ALLOW_ORIGINS', 'ENVIRONMENT']
    
    env_status = {
        "critical": {},
        "optional": {}
    }
    
    for var in critical_vars:
        value = os.getenv(var)
        env_status["critical"][var] = {
            "set": value is not None,
            "has_value": bool(value) if value else False
        }
    
    for var in optional_vars:
        value = os.getenv(var)
        env_status["optional"][var] = {
            "set": value is not None,
            "value": value if value else None
        }
    
    return env_status

def check_dependencies():
    """Check if critical dependencies are available"""
    dependencies = {}
    
    critical_deps = ['fastapi', 'sqlalchemy', 'uvicorn', 'psutil']
    
    for dep in critical_deps:
        try:
            __import__(dep)
            dependencies[dep] = {"status": "ok", "available": True}
        except ImportError:
            dependencies[dep] = {"status": "error", "available": False}
        except Exception as e:
            dependencies[dep] = {"status": "warning", "available": True, "error": str(e)}
    
    return dependencies

@router.get("/cv")
def cv_health():
    """Detailed CV service health check"""
    health_data = {
        "service": "CV Upload & Processing",
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    # Check upload directory
    upload_dir = Path(__file__).parent / "uploaded_cvs"
    try:
        upload_dir.mkdir(exist_ok=True)
        test_file = upload_dir / f"health_test_{datetime.datetime.now().timestamp()}.txt"
        test_file.write_text("CV health check")
        file_size = test_file.stat().st_size
        test_file.unlink()
        
        health_data["checks"]["upload_directory"] = {
            "status": "ok",
            "path": str(upload_dir),
            "writable": True,
            "test_file_size": file_size
        }
    except Exception as e:
        health_data["checks"]["upload_directory"] = {
            "status": "error",
            "error": str(e),
            "path": str(upload_dir),
            "writable": False
        }
        health_data["status"] = "error"
    
    # Check CV processing dependencies
    try:
        # Try importing CV-related modules
        import cv
        health_data["checks"]["cv_module"] = {"status": "ok", "importable": True}
    except Exception as e:
        health_data["checks"]["cv_module"] = {"status": "error", "error": str(e)}
        health_data["status"] = "error"
    
    # Check file count in upload directory
    try:
        file_count = len(list(upload_dir.glob("*"))) if upload_dir.exists() else 0
        health_data["checks"]["uploaded_files"] = {
            "status": "ok",
            "count": file_count,
            "directory_exists": upload_dir.exists()
        }
    except Exception as e:
        health_data["checks"]["uploaded_files"] = {"status": "error", "error": str(e)}
    
    return health_data

@router.get("/portfolio")
def portfolio_health():
    """Detailed Portfolio service health check"""
    health_data = {
        "service": "Portfolio Generation",
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    # Check portfolio output directory
    portfolio_dir = Path(__file__).parent / "generated_portfolios"
    try:
        portfolio_dir.mkdir(exist_ok=True)
        test_file = portfolio_dir / f"health_test_{datetime.datetime.now().timestamp()}.html"
        test_file.write_text("<html><body>Portfolio health check</body></html>")
        file_size = test_file.stat().st_size
        test_file.unlink()
        
        health_data["checks"]["portfolio_directory"] = {
            "status": "ok",
            "path": str(portfolio_dir),
            "writable": True,
            "test_file_size": file_size
        }
    except Exception as e:
        health_data["checks"]["portfolio_directory"] = {
            "status": "error",
            "error": str(e),
            "path": str(portfolio_dir),
            "writable": False
        }
        health_data["status"] = "error"
    
    # Check portfolio module
    try:
        import portfolio
        health_data["checks"]["portfolio_module"] = {"status": "ok", "importable": True}
    except Exception as e:
        health_data["checks"]["portfolio_module"] = {"status": "error", "error": str(e)}
        health_data["status"] = "error"
    
    # Check generated portfolio count
    try:
        portfolio_count = len(list(portfolio_dir.glob("*.html"))) if portfolio_dir.exists() else 0
        health_data["checks"]["generated_portfolios"] = {
            "status": "ok",
            "count": portfolio_count,
            "directory_exists": portfolio_dir.exists()
        }
    except Exception as e:
        health_data["checks"]["generated_portfolios"] = {"status": "error", "error": str(e)}
    
    return health_data

@router.get("/ats")
def ats_health():
    """Detailed ATS Resume service health check"""
    health_data = {
        "service": "ATS Resume Generation", 
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    # Check ATS resume output directory
    ats_dir = Path(__file__).parent / "generated_resumes"
    try:
        ats_dir.mkdir(exist_ok=True)
        test_file = ats_dir / f"health_test_{datetime.datetime.now().timestamp()}.docx"
        test_file.write_text("ATS health check")
        file_size = test_file.stat().st_size
        test_file.unlink()
        
        health_data["checks"]["ats_directory"] = {
            "status": "ok",
            "path": str(ats_dir),
            "writable": True,
            "test_file_size": file_size
        }
    except Exception as e:
        health_data["checks"]["ats_directory"] = {
            "status": "error",
            "error": str(e),
            "path": str(ats_dir),
            "writable": False
        }
        health_data["status"] = "error"
    
    # Check ATS module
    try:
        import ats_resume
        health_data["checks"]["ats_module"] = {"status": "ok", "importable": True}
    except Exception as e:
        health_data["checks"]["ats_module"] = {"status": "error", "error": str(e)}
        health_data["status"] = "error"
    
    # Check generated resume count
    try:
        resume_count = len(list(ats_dir.glob("*.docx"))) if ats_dir.exists() else 0
        health_data["checks"]["generated_resumes"] = {
            "status": "ok",
            "count": resume_count,
            "directory_exists": ats_dir.exists()
        }
    except Exception as e:
        health_data["checks"]["generated_resumes"] = {"status": "error", "error": str(e)}
    
    return health_data

@router.get("/analytics")
def analytics_health():
    """Analytics service health check"""
    health_data = {
        "service": "Analytics",
        "status": "ok", 
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    try:
        import analytics
        health_data["checks"]["analytics_module"] = {"status": "ok", "importable": True}
    except Exception as e:
        health_data["checks"]["analytics_module"] = {"status": "error", "error": str(e)}
        health_data["status"] = "error"
    
    # Check database connectivity for analytics
    try:
        with engine.connect() as conn:
            # Check if we can query user table for analytics
            result = conn.execute(text("SELECT COUNT(*) FROM users")).fetchone()
            user_count = result[0] if result else 0
            
        health_data["checks"]["analytics_data"] = {
            "status": "ok",
            "user_count": user_count,
            "database_accessible": True
        }
    except Exception as e:
        health_data["checks"]["analytics_data"] = {
            "status": "error",
            "error": str(e),
            "database_accessible": False
        }
        health_data["status"] = "error"
    
    return health_data

@router.get("/users")
def users_health():
    """User management service health check"""
    health_data = {
        "service": "User Management",
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(), 
        "checks": {}
    }
    
    try:
        import users
        health_data["checks"]["users_module"] = {"status": "ok", "importable": True}
    except Exception as e:
        health_data["checks"]["users_module"] = {"status": "error", "error": str(e)}
        health_data["status"] = "error"
    
    # Check user database operations
    try:
        with engine.connect() as conn:
            # Test user table structure
            result = conn.execute(text("SELECT COUNT(*) FROM users")).fetchone()
            user_count = result[0] if result else 0
            
            # Check if admin user exists
            admin_result = conn.execute(text("SELECT COUNT(*) FROM users WHERE is_admin = 1")).fetchone()
            admin_count = admin_result[0] if admin_result else 0
            
        health_data["checks"]["user_database"] = {
            "status": "ok",
            "total_users": user_count,
            "admin_users": admin_count,
            "table_accessible": True
        }
    except Exception as e:
        health_data["checks"]["user_database"] = {
            "status": "error", 
            "error": str(e),
            "table_accessible": False
        }
        health_data["status"] = "error"
    
    return health_data

@router.get("/ai")
def ai_services_health():
    """AI services health check"""
    health_data = {
        "service": "AI Services",
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    # Check AI service API keys configuration
    ai_services = {
        "deepseek": os.getenv("DEEPSEEK_API_KEY"),
        "openrouter": os.getenv("OPENROUTER_API_KEY"),
        "groq": os.getenv("GROQ_API_KEY"),
        "openai": os.getenv("OPENAI_API_KEY")
    }
    
    configured_services = []
    missing_services = []
    
    for service, api_key in ai_services.items():
        if api_key and api_key.strip():
            configured_services.append(service)
            health_data["checks"][f"{service}_api_key"] = {
                "status": "configured",
                "has_key": True,
                "key_length": len(api_key)
            }
        else:
            missing_services.append(service)
            health_data["checks"][f"{service}_api_key"] = {
                "status": "missing",
                "has_key": False
            }
    
    # Check AI-related modules
    try:
        # Check if cv_ai module exists
        cv_ai_path = Path(__file__).parent.parent / "ai_services" / "cv_ai.py"
        if cv_ai_path.exists():
            health_data["checks"]["cv_ai_module"] = {"status": "ok", "exists": True}
        else:
            health_data["checks"]["cv_ai_module"] = {"status": "warning", "exists": False}
    except Exception as e:
        health_data["checks"]["cv_ai_module"] = {"status": "error", "error": str(e)}
    
    try:
        # Check vector RAG module
        vector_rag_path = Path(__file__).parent.parent / "ai_services" / "vector_rag.py"
        if vector_rag_path.exists():
            health_data["checks"]["vector_rag_module"] = {"status": "ok", "exists": True}
        else:
            health_data["checks"]["vector_rag_module"] = {"status": "warning", "exists": False}
    except Exception as e:
        health_data["checks"]["vector_rag_module"] = {"status": "error", "error": str(e)}
    
    # Overall AI services status
    if not configured_services:
        health_data["status"] = "warning"
        health_data["message"] = "No AI services configured"
    elif missing_services:
        health_data["status"] = "warning" if len(configured_services) > 0 else "error"
        health_data["message"] = f"Missing: {', '.join(missing_services)}"
    else:
        health_data["message"] = f"All services configured: {', '.join(configured_services)}"
    
    health_data["summary"] = {
        "configured_count": len(configured_services),
        "missing_count": len(missing_services),
        "configured_services": configured_services,
        "missing_services": missing_services
    }
    
    return health_data

@router.get("/logs")
def logs_health():
    """Logs service health check"""
    health_data = {
        "service": "Logging System",
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    try:
        import logs
        health_data["checks"]["logs_module"] = {"status": "ok", "importable": True}
    except Exception as e:
        health_data["checks"]["logs_module"] = {"status": "error", "error": str(e)}
        health_data["status"] = "error"
    
    # Check log directory
    try:
        logs_dir = Path(__file__).parent / "logs"
        if logs_dir.exists():
            log_files = list(logs_dir.glob("*.log"))
            health_data["checks"]["log_directory"] = {
                "status": "ok",
                "exists": True,
                "log_files_count": len(log_files)
            }
        else:
            health_data["checks"]["log_directory"] = {
                "status": "warning",
                "exists": False,
                "message": "Logs directory does not exist"
            }
    except Exception as e:
        health_data["checks"]["log_directory"] = {"status": "error", "error": str(e)}
    
    return health_data

@router.get("/endpoints")
async def endpoints_health():
    """Check health of main API endpoints"""
    health_data = {
        "service": "API Endpoints",
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    # Define endpoints to check
    endpoints_to_check = [
        {"name": "healthz", "url": "/healthz", "method": "GET"},
        {"name": "portfolio_templates", "url": "/api/v1/portfolio/templates/", "method": "GET"},
        {"name": "ats_templates", "url": "/api/v1/ats/templates/", "method": "GET"},
        {"name": "analytics_dashboard", "url": "/api/v1/analytics/dashboard", "method": "GET"},
        {"name": "logs", "url": "/logs", "method": "GET"},
    ]
    
    base_url = f"http://127.0.0.1:{os.getenv('PORT', '8000')}"
    
    async def check_endpoint(endpoint):
        try:
            import httpx
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{base_url}{endpoint['url']}")
                return {
                    "status": "ok" if response.status_code < 400 else "error",
                    "status_code": response.status_code,
                    "response_time_ms": response.elapsed.total_seconds() * 1000
                }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "status_code": None
            }
    
    # Check each endpoint
    for endpoint in endpoints_to_check:
        try:
            check_result = await check_endpoint(endpoint)
            health_data["checks"][endpoint["name"]] = check_result
            if check_result["status"] != "ok":
                health_data["status"] = "warning"
        except Exception as e:
            health_data["checks"][endpoint["name"]] = {
                "status": "error",
                "error": str(e)
            }
            health_data["status"] = "error"
    
    return health_data
