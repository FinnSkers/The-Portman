from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import random
from pydantic import BaseModel

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# Data models for analytics
class MetricsData(BaseModel):
    cvs_processed: int
    portfolios_generated: int
    ats_resumes_created: int
    total_downloads: int
    avg_ats_score: float

class TemplateUsage(BaseModel):
    name: str
    count: int
    percentage: float

class PerformanceMetrics(BaseModel):
    avg_processing_time: float
    success_rate: float
    user_satisfaction: float

class UserEngagement(BaseModel):
    daily_active_users: int
    weekly_active_users: int
    monthly_active_users: int
    avg_session_duration: float

class ActivityItem(BaseModel):
    id: str
    type: str
    description: str
    timestamp: datetime
    user: str

class GeographicData(BaseModel):
    country: str
    users: int
    percentage: float

class AnalyticsResponse(BaseModel):
    metrics: MetricsData
    popular_templates: List[TemplateUsage]
    performance: PerformanceMetrics
    user_engagement: UserEngagement
    recent_activity: List[ActivityItem]
    geographic_distribution: List[GeographicData]
    last_updated: datetime

# Mock data storage - In production, this would come from a database
def generate_mock_analytics_data(time_range: str = "24h") -> AnalyticsResponse:
    """Generate realistic mock analytics data based on time range"""
    
    # Base multipliers for different time ranges
    multipliers = {
        "24h": 1,
        "7d": 7,
        "30d": 30,
        "90d": 90
    }
    
    multiplier = multipliers.get(time_range, 1)
    base_factor = multiplier * random.uniform(0.8, 1.2)
    
    # Generate metrics
    metrics = MetricsData(
        cvs_processed=int(245 * base_factor),
        portfolios_generated=int(189 * base_factor),
        ats_resumes_created=int(156 * base_factor),
        total_downloads=int(423 * base_factor),
        avg_ats_score=round(random.uniform(82.5, 89.5), 1)
    )
    
    # Popular templates with realistic distribution
    templates = [
        ("Modern Glass", random.randint(35, 45)),
        ("Professional Clean", random.randint(25, 35)),
        ("Creative Portfolio", random.randint(15, 25)),
        ("Minimal Elegant", random.randint(10, 20))
    ]
    
    total_templates = sum(count for _, count in templates)
    popular_templates = [
        TemplateUsage(
            name=name,
            count=int(count * base_factor),
            percentage=round((count / total_templates) * 100, 1)
        )
        for name, count in templates
    ]
    
    # Performance metrics
    performance = PerformanceMetrics(
        avg_processing_time=round(random.uniform(2.1, 3.8), 1),
        success_rate=round(random.uniform(96.5, 99.2), 1),
        user_satisfaction=round(random.uniform(4.6, 4.9), 1)
    )
    
    # User engagement
    user_engagement = UserEngagement(
        daily_active_users=int(156 * (base_factor if time_range == "24h" else 1)),
        weekly_active_users=int(892 * (base_factor if time_range in ["24h", "7d"] else 1)),
        monthly_active_users=int(2341 * (base_factor if time_range != "90d" else 1)),
        avg_session_duration=round(random.uniform(8.2, 12.7), 1)
    )
    
    # Recent activity
    activity_types = [
        ("cv_upload", "CV uploaded and parsed"),
        ("portfolio_generated", "Portfolio website generated"),
        ("ats_resume", "ATS-optimized resume created"),
        ("template_customized", "Template customized"),
        ("download", "File downloaded")
    ]
    
    recent_activity = []
    for i in range(min(15, int(20 * (base_factor / 10)))):
        activity_type, description = random.choice(activity_types)
        recent_activity.append(
            ActivityItem(
                id=f"activity_{i+1}",
                type=activity_type,
                description=description,
                timestamp=datetime.now() - timedelta(minutes=random.randint(1, 1440)),
                user=f"user_{random.randint(100, 999)}"
            )
        )
    
    # Geographic distribution
    countries = [
        ("United States", random.randint(25, 35)),
        ("United Kingdom", random.randint(15, 25)),
        ("Canada", random.randint(10, 20)),
        ("Australia", random.randint(8, 15)),
        ("Germany", random.randint(6, 12)),
        ("France", random.randint(5, 10)),
        ("Other", random.randint(15, 25))
    ]
    
    total_geo = sum(count for _, count in countries)
    geographic_distribution = [
        GeographicData(
            country=country,
            users=int(count * base_factor),
            percentage=round((count / total_geo) * 100, 1)
        )
        for country, count in countries
    ]
    
    return AnalyticsResponse(
        metrics=metrics,
        popular_templates=popular_templates,
        performance=performance,
        user_engagement=user_engagement,
        recent_activity=sorted(recent_activity, key=lambda x: x.timestamp, reverse=True),
        geographic_distribution=geographic_distribution,
        last_updated=datetime.now()
    )

@router.get("/dashboard", response_model=AnalyticsResponse)
async def get_analytics_dashboard(
    time_range: str = Query(default="24h", regex="^(24h|7d|30d|90d)$", description="Time range for analytics data")
):
    """
    Get comprehensive analytics dashboard data
    
    - **time_range**: Time range for data aggregation (24h, 7d, 30d, 90d)
    """
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        return analytics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics data: {str(e)}")

@router.get("/metrics", response_model=MetricsData)
async def get_key_metrics(
    time_range: str = Query(default="24h", regex="^(24h|7d|30d|90d)$")
):
    """Get key platform metrics"""
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        return analytics_data.metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch metrics: {str(e)}")

@router.get("/templates", response_model=List[TemplateUsage])
async def get_template_usage(
    time_range: str = Query(default="24h", regex="^(24h|7d|30d|90d)$")
):
    """Get template usage statistics"""
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        return analytics_data.popular_templates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch template usage: {str(e)}")

@router.get("/performance", response_model=PerformanceMetrics)
async def get_performance_metrics(
    time_range: str = Query(default="24h", regex="^(24h|7d|30d|90d)$")
):
    """Get system performance metrics"""
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        return analytics_data.performance
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch performance metrics: {str(e)}")

@router.get("/engagement", response_model=UserEngagement)
async def get_user_engagement(
    time_range: str = Query(default="24h", regex="^(24h|7d|30d|90d)$")
):
    """Get user engagement statistics"""
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        return analytics_data.user_engagement
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user engagement: {str(e)}")

@router.get("/activity", response_model=List[ActivityItem])
async def get_recent_activity(
    time_range: str = Query(default="24h", regex="^(24h|7d|30d|90d)$"),
    limit: int = Query(default=15, ge=1, le=50, description="Number of recent activities to return")
):
    """Get recent platform activity"""
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        return analytics_data.recent_activity[:limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recent activity: {str(e)}")

@router.get("/geographic", response_model=List[GeographicData])
async def get_geographic_distribution(
    time_range: str = Query(default="24h", regex="^(24h|7d|30d|90d)$")
):
    """Get geographic distribution of users"""
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        return analytics_data.geographic_distribution
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch geographic data: {str(e)}")

# Real-time analytics endpoint for WebSocket connections (future implementation)
@router.get("/realtime/status")
async def get_realtime_status():
    """Get real-time system status"""
    return {
        "status": "operational",
        "active_connections": random.randint(45, 120),
        "processing_queue": random.randint(0, 5),
        "last_updated": datetime.now(),
        "websocket_endpoint": "/ws/analytics"  # Future WebSocket endpoint
    }

# Export summary for admins and power users
@router.get("/export/summary")
async def export_analytics_summary(
    time_range: str = Query(default="30d", regex="^(24h|7d|30d|90d)$"),
    format: str = Query(default="json", regex="^(json|csv)$")
):
    """Export analytics summary for external analysis"""
    try:
        analytics_data = generate_mock_analytics_data(time_range)
        
        if format == "csv":
            # In a real implementation, this would return CSV data
            return {
                "message": "CSV export functionality to be implemented",
                "data_points": len(analytics_data.recent_activity),
                "time_range": time_range
            }
        
        return {
            "export_type": "analytics_summary",
            "time_range": time_range,
            "generated_at": datetime.now(),
            "data": analytics_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export analytics: {str(e)}")
