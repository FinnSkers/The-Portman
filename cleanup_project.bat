@echo off
REM PORTMAN Project Cleanup Script
REM This script removes unnecessary files and folders

echo 🧹 PORTMAN Project Cleanup
echo ===========================
echo.
echo This will remove unnecessary files from your project.
echo Make sure you have committed any important changes to Git before proceeding.
echo.
pause

echo 🗂️  Removing archive directory...
if exist "archive" (
    rmdir /s /q "archive"
    echo ✅ Removed archive directory
) else (
    echo ⚠️  Archive directory not found
)

echo.
echo 📄 Removing obsolete documentation files...

REM Documentation files to remove
set files="AUTHENTICATION_SYSTEM_COMPLETE.md" "Backend.md" "BACKEND_IMPROVEMENT_PLAN.md" "BACKEND_TESTING_REPORT.md" "CLEANUP_REPORT.md" "DEVELOPMENT.md" "FRONTEND_BUILD_STATUS.md" "FRONTEND_COMPLETION_STATUS.md" "FRONTEND_FINAL_STATUS.md" "FRONTEND_FIXES_COMPLETED.md" "FRONTEND_PROGRESS.txt" "GITHUB_PUSH_COMPLETE.md" "INTEGRATION_STATUS.md" "MODERN_BACKEND_ARCHITECTURE.md" "MODERN_BACKEND_COMPLETE.md" "MODERN_STATUS_ENHANCEMENT_COMPLETE.md" "PROGRESS.md" "PROGRESS_FRONTEND.md" "PROJECT_STATUS.md" "STATUS_404_ERROR_RESOLVED.md" "VERCEL_DEPLOYMENT.md" "VERCEL_SETUP_GUIDE.md" "PORTMAN.txt" "PORTMAN_PROJECT_OVERVIEW.txt"

for %%f in (%files%) do (
    if exist %%f (
        del %%f
        echo ✅ Removed %%f
    )
)

echo.
echo 🧪 Removing test files...

REM Test files to remove
set testFiles="comprehensive_api_test.py" "comprehensive_test.py" "integration_test.js" "test_api.js" "test_api_fix.js" "test_ats_api.py" "test_cv.txt" "test_cv_analysis.py" "test_cv_sample.txt" "test_deepseek_config.py" "test_modern_api.py" "test_modern_status_complete.py" "test_modern_status_system.py"

for %%f in (%testFiles%) do (
    if exist %%f (
        del %%f
        echo ✅ Removed %%f
    )
)

echo.
echo 📦 Removing root package files...
if exist "package.json" (
    del "package.json"
    echo ✅ Removed root package.json
)
if exist "package-lock.json" (
    del "package-lock.json"
    echo ✅ Removed root package-lock.json
)

echo.
echo 🔧 Removing obsolete batch scripts...
set batchFiles="start_modern_backend.bat" "start_modern_backend_migration.bat" "start_portman_dev.bat"

for %%f in (%batchFiles%) do (
    if exist %%f (
        del %%f
        echo ✅ Removed %%f
    )
)

echo.
echo 🐍 Cleaning backend directory...
cd backend

REM Backend files to remove
set backendFiles="check_users.py" "create_admin.py" "init_database.py" "migrate_cv_fields.py" "migrate_db.py" "setup_users.py" "simple_test.py" "parsed_cv.json" "test_ats.py" "test_ats_full.py" "test_auth.py" "test_auth_api.py" "test_auth_complete.py" "test_auth_complete_system.py" "test_comprehensive.py" "test_full_workflow.py" "test_modern_comprehensive.py" "test_modern_setup.py" "test_server.py" "test_server_start.py" "test_resume.docx" "run.py" "start_backend.bat" "start_backend_test.bat" "start_modern.bat" "start_modern.py" "start_modern_enhanced.py" "README_MIGRATION.md" "README_MODERN.md" "test.db" "requirements_modern.txt"

for %%f in (%backendFiles%) do (
    if exist %%f (
        del %%f
        echo ✅ Removed backend/%%f
    )
)

cd ..

echo.
echo 🌐 Cleaning frontend directory...
cd frontend

if exist "Frontend.md" (
    del "Frontend.md"
    echo ✅ Removed Frontend.md
)

cd ..

echo.
echo 🗑️  Removing cache directories...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo ✅ Removed root node_modules
)

if exist "frontend\.next" (
    rmdir /s /q "frontend\.next"
    echo ✅ Removed frontend/.next
)

if exist "frontend\node_modules" (
    rmdir /s /q "frontend\node_modules"
    echo ✅ Removed frontend/node_modules
)

if exist "backend\__pycache__" (
    rmdir /s /q "backend\__pycache__"
    echo ✅ Removed backend/__pycache__
)

echo.
echo ✅ Cleanup completed!
echo.
echo 📁 Your project structure is now clean and organized.
echo 📝 Key files kept:
echo    - README.md
echo    - VERCEL_AUTO_DEPLOYMENT.md
echo    - PROJECT_CLEANUP_PLAN.md
echo    - All essential source code
echo    - Configuration files
echo.
echo 🚀 Next steps:
echo    1. Reinstall dependencies: cd frontend ^&^& npm install
echo    2. Test the build: npm run build
echo    3. Test Vercel deployment: npm run deploy
echo    4. Commit the cleaned project: git add . ^&^& git commit -m "Clean up project structure"
echo.
pause
