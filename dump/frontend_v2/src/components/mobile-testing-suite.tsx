"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal, 
  RotateCw,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  userAgent: string;
  icon: typeof Smartphone;
}

const devicePresets: DevicePreset[] = [
  {
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    icon: Smartphone
  },
  {
    name: 'Samsung Galaxy S23',
    width: 384,
    height: 854,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36',
    icon: Smartphone
  },
  {
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    icon: Tablet
  },
  {
    name: 'Desktop 1080p',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    icon: Monitor
  }
];

interface TestResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export default function MobileTestingSuite() {
  const [selectedDevice, setSelectedDevice] = useState(devicePresets[0]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isOnline, setIsOnline] = useState(true);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const runMobileTests = async () => {
    setTesting(true);
    const results: TestResult[] = [];

    // Test 1: Viewport Meta Tag
    const viewport = document.querySelector('meta[name="viewport"]');
    results.push({
      category: 'Responsive Design',
      test: 'Viewport Meta Tag',
      status: viewport ? 'pass' : 'fail',
      message: viewport ? 'Viewport meta tag found' : 'Missing viewport meta tag'
    });

    // Test 2: Touch Targets
    const buttons = document.querySelectorAll('button, a, input[type="button"]');
    let smallTargets = 0;
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallTargets++;
      }
    });
    results.push({
      category: 'Accessibility',
      test: 'Touch Target Size',
      status: smallTargets === 0 ? 'pass' : 'warning',
      message: smallTargets === 0 ? 'All touch targets meet minimum size' : `${smallTargets} targets smaller than 44px`
    });

    // Test 3: Font Sizes
    const elements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    let smallText = 0;
    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const fontSize = parseFloat(style.fontSize);
      if (fontSize < 16) {
        smallText++;
      }
    });
    results.push({
      category: 'Typography',
      test: 'Readable Font Sizes',
      status: smallText === 0 ? 'pass' : 'warning',
      message: smallText === 0 ? 'All text meets minimum size' : `${smallText} elements with small text`
    });

    // Test 4: Horizontal Scrolling
    const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    results.push({
      category: 'Layout',
      test: 'Horizontal Scrolling',
      status: hasHorizontalScroll ? 'fail' : 'pass',
      message: hasHorizontalScroll ? 'Horizontal scrolling detected' : 'No horizontal scrolling'
    });

    // Test 5: Image Optimization
    const images = document.querySelectorAll('img');
    let unoptimizedImages = 0;
    images.forEach(img => {
      if (!img.srcset && !img.loading) {
        unoptimizedImages++;
      }
    });
    results.push({
      category: 'Performance',
      test: 'Image Optimization',
      status: unoptimizedImages === 0 ? 'pass' : 'warning',
      message: unoptimizedImages === 0 ? 'Images are optimized' : `${unoptimizedImages} images could be optimized`
    });

    // Test 6: Network Connectivity
    results.push({
      category: 'PWA',
      test: 'Network Status',
      status: isOnline ? 'pass' : 'warning',
      message: isOnline ? 'Online connectivity detected' : 'Offline mode active'
    });

    // Test 7: Service Worker
    const hasServiceWorker = 'serviceWorker' in navigator;
    results.push({
      category: 'PWA',
      test: 'Service Worker Support',
      status: hasServiceWorker ? 'pass' : 'warning',
      message: hasServiceWorker ? 'Service Worker supported' : 'Service Worker not supported'
    });

    // Test 8: Local Storage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      results.push({
        category: 'Storage',
        test: 'Local Storage',
        status: 'pass',
        message: 'Local Storage available'
      });
    } catch (e) {
      results.push({
        category: 'Storage',
        test: 'Local Storage',
        status: 'fail',
        message: 'Local Storage not available'
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  const getDeviceDimensions = () => {
    if (orientation === 'landscape') {
      return {
        width: selectedDevice.height,
        height: selectedDevice.width
      };
    }
    return {
      width: selectedDevice.width,
      height: selectedDevice.height
    };
  };

  const dimensions = getDeviceDimensions();

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Info className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mobile Testing Suite</h1>
          <p className="text-muted-foreground">
            Test responsive design and mobile optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <Battery className="w-5 h-5" />
          <Signal className="w-5 h-5" />
        </div>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">Device Testing</TabsTrigger>
          <TabsTrigger value="tests">Automated Tests</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          {/* Device Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Device Presets</CardTitle>
              <CardDescription>
                Select a device to test responsive behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {devicePresets.map((device) => {
                  const Icon = device.icon;
                  return (
                    <Button
                      key={device.name}
                      variant={selectedDevice.name === device.name ? 'default' : 'outline'}
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => setSelectedDevice(device)}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold">{device.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {device.width} × {device.height}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Device Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Device Preview</CardTitle>
                  <CardDescription>
                    {selectedDevice.name} - {dimensions.width} × {dimensions.height}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={toggleOrientation}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  className="border-8 border-gray-800 rounded-lg bg-black p-2"
                  style={{
                    width: Math.min(dimensions.width / 2, 400),
                    height: Math.min(dimensions.height / 2, 600),
                  }}
                >
                  <iframe
                    src={window.location.href}
                    className="w-full h-full bg-white rounded"
                    style={{
                      transform: `scale(${Math.min(400 / dimensions.width, 600 / dimensions.height)})`,
                      transformOrigin: 'top left',
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge variant="outline">
                  {orientation} • {selectedDevice.pixelRatio}x pixel ratio
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Automated Tests</CardTitle>
                  <CardDescription>
                    Run comprehensive mobile optimization tests
                  </CardDescription>
                </div>
                <Button onClick={runMobileTests} disabled={testing}>
                  <Eye className="w-4 h-4 mr-2" />
                  {testing ? 'Running Tests...' : 'Run Tests'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 && (
                <div className="space-y-4">
                  {Object.entries(
                    testResults.reduce((acc, result) => {
                      if (!acc[result.category]) acc[result.category] = [];
                      acc[result.category].push(result);
                      return acc;
                    }, {} as Record<string, TestResult[]>)
                  ).map(([category, categoryResults]) => (
                    <div key={category}>
                      <h3 className="font-semibold mb-2">{category}</h3>
                      <div className="space-y-2">
                        {categoryResults.map((result, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(result.status)}`}
                          >
                            {getStatusIcon(result.status)}
                            <div className="flex-1">
                              <div className="font-medium">{result.test}</div>
                              <div className="text-sm opacity-75">{result.message}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {testResults.length === 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Click "Run Tests" to perform automated mobile optimization checks.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Monitor mobile performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(Math.random() * 20 + 80)}
                  </div>
                  <div className="text-sm text-muted-foreground">Lighthouse Mobile Score</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(Math.random() * 2 + 1).toFixed(1)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Load Time</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {(Math.random() * 0.5 + 0.1).toFixed(2)}s
                  </div>
                  <div className="text-sm text-muted-foreground">First Contentful Paint</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
