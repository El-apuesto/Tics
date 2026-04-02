import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Save, Plus, Trash2, LogOut, DollarSign, Calendar, Video, ShoppingBag, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Show, Video as VideoType, Donation, Product } from '@/types';
import { API_BASE } from '@/lib/api-config';

// Debug: Log API_BASE
console.log('AdminDashboard API_BASE:', API_BASE);

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default credentials
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'tourettes2026';

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [wakingUp, setWakingUp] = useState(false);

  const wakeUpServer = async () => {
    setWakingUp(true);
    try {
      await fetch(`${API_BASE}/shows`);
      alert('Server is waking up...');
    } catch (error) {
      alert('Server wake-up initiated');
    } finally {
      setWakingUp(false);
    }
  };

  // Alt+Space+Enter combo for /dash page too
  useEffect(() => {
    const keysPressed = new Set();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key);
      
      // Check for Alt+Space+Enter on /dash page
      if (e.altKey && e.key === ' ' && keysPressed.has('Enter')) {
        e.preventDefault();
        // Reveal password field on /dash page
        setShowPassword(false);
        setPassword('');
        setUsername('');
        setError('');
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      console.log('Attempting login to:', API_BASE);
      console.log('Credentials:', { username, password: '***' });
      
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setIsAuthenticated(true);
        setAuthToken(data.token);
        setError('');
        // Load data after successful login
        await loadData();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  // Admin data state
  const [shows, setShows] = useState<Show[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [photos, setPhotos] = useState<{id: string, url: string, title: string}[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Load data from API
  const loadData = async () => {
    try {
      const [showsRes, videosRes, donationsRes, productsRes, photosRes] = await Promise.all([
        fetch(`${API_BASE}/shows`),
        fetch(`${API_BASE}/videos`),
        fetch(`${API_BASE}/donations`),
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/photos`)
      ]);

      const [showsData, videosData, donationsData, productsData, photosData] = await Promise.all([
        showsRes.json(),
        videosRes.json(),
        donationsRes.json(),
        productsRes.json(),
        photosRes.json()
      ]);

      setShows(showsData);
      setVideos(videosData);
      setDonations(donationsData);
      setProducts(productsData.map(p => ({ ...p, variants: JSON.parse(p.variants || '[]') })));
      setPhotos(photosData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  // Load data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && authToken) {
      loadData();
    }
  }, [isAuthenticated, authToken]);

  const handleUpdateCredentials = async () => {
    if (newUsername && newPassword) {
      try {
        const response = await fetch(`${API_BASE}/admin/credentials`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ username: newUsername, password: newPassword }),
        });

        if (response.ok) {
          alert('Credentials updated successfully!');
        } else {
          alert('Failed to update credentials.');
        }
      } catch (err) {
        alert('Error updating credentials.');
      }
    }
  };

  const handleAddShow = async () => {
    const newShow: Show = {
      id: Date.now().toString(),
      date: 'March 15, 8:00 PM',
      startTime: '8:00 PM',
      venue: 'New Venue',
      location: 'New Location',
      link: ''
    };

    try {
      const response = await fetch(`${API_BASE}/shows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(newShow),
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to add show:', err);
    }
  };

  const handleUpdateShow = async (id: string, field: keyof Show, value: string) => {
    try {
      const show = shows.find(s => s.id === id);
      if (show) {
        const updatedShow = { ...show, [field]: value };
        const response = await fetch(`${API_BASE}/shows/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedShow),
        });

        if (response.ok) {
          await loadData(); // Reload data
        }
      }
    } catch (err) {
      console.error('Failed to update show:', err);
    }
  };

  const handleDeleteShow = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/shows/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to delete show:', err);
    }
  };

  const handleAddVideo = async () => {
    const newVideo: VideoType = {
      id: Date.now().toString(),
      title: 'New Video',
      thumbnail: '/video_reel.jpg',
      url: '',
      embedUrl: ''
    };

    try {
      const response = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(newVideo),
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to add video:', err);
    }
  };

  const handleUpdateVideo = async (id: string, field: keyof VideoType, value: string) => {
    try {
      const video = videos.find(v => v.id === id);
      if (video) {
        const updatedVideo = { ...video, [field]: value };
        const response = await fetch(`${API_BASE}/videos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedVideo),
        });

        if (response.ok) {
          await loadData(); // Reload data
        }
      }
    } catch (err) {
      console.error('Failed to update video:', err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to delete video:', err);
    }
  };

  const handleAddProduct = async () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      description: 'Product description',
      price: 25,
      image: '/product_tshirt_1.jpg',
      category: 'apparel',
      variants: ['Men\'s T-Shirt', 'Women\'s T-Shirt', 'Unisex Sweater'],
      printfulUrl: 'https://www.printful.com/'
    };

    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleUpdateProduct = async (id: string, field: keyof Product, value: string | number) => {
    try {
      const product = products.find(p => p.id === id);
      if (product) {
        const updatedProduct = { ...product, [field]: value };
        const response = await fetch(`${API_BASE}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          await loadData(); // Reload data
        }
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleAddPhoto = async () => {
    const newPhoto = {
      id: Date.now().toString(),
      title: 'New Photo',
      url: '/placeholder-image.jpg'
    };

    try {
      const response = await fetch(`${API_BASE}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(newPhoto),
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to add photo:', err);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/photos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const handleUpdatePhoto = async (id: string, field: string, value: string) => {
    try {
      const photo = photos.find(p => p.id === id);
      if (photo) {
        const updatedPhoto = { ...photo, [field]: value };
        const response = await fetch(`${API_BASE}/photos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedPhoto),
        });

        if (response.ok) {
          await loadData(); // Reload data
        }
      }
    } catch (err) {
      console.error('Failed to update photo:', err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setAuthToken('');
    onClose();
  };

  // Keyboard shortcut listener (Ctrl + Tab + Down Arrow)
  useEffect(() => {
    const keysPressed = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key);
      
      // Check for Ctrl + Tab + ArrowDown
      if (
        keysPressed.has('Control') &&
        keysPressed.has('Tab') &&
        keysPressed.has('ArrowDown')
      ) {
        e.preventDefault();
        // Open admin (you'll need to pass a prop to trigger this from parent)
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-2xl flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              Admin Login
            </DialogTitle>
            <DialogDescription>
              Enter your credentials to access the admin dashboard
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm mb-4 animate-shake">
                <span className="inline-block animate-bounce">❌</span>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button onClick={handleLogin} className="w-full btn-primary">
              <Lock className="w-4 h-4 mr-2" />
              Login
            </Button>
            
            <Button 
              onClick={wakeUpServer} 
              disabled={wakingUp}
              variant="secondary" 
              className="w-full"
            >
              {wakingUp ? 'Waking up...' : 'Wake Up Server'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-card border-border max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-black text-2xl flex items-center justify-between">
            <span className="flex items-center gap-3">
              Admin Dashboard
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="shows" className="pt-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="shows">
              <Calendar className="w-4 h-4 mr-2" />
              Shows
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="donations">
              <DollarSign className="w-4 h-4 mr-2" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="photos">
              <Image className="w-4 h-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Lock className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Shows Tab */}
          <TabsContent value="shows" className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-bold text-primary mb-2">Show Management Rules:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Day only</strong> (e.g., "Monday"): Reappears weekly on Sunday refresh</li>
                <li>• <strong>Day + Number</strong> (e.g., "Monday 15"): Reappears monthly on that day</li>
                <li>• <strong>Month + Date</strong> (e.g., "Mar 15"): Removed forever after date passes</li>
                <li>• Shows are automatically removed when their day/time has passed</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Upcoming Shows</h3>
              <Button onClick={handleAddShow} size="sm" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Show
              </Button>
            </div>
            
            <div className="space-y-3">
              {shows.map((show) => (
                <div key={show.id} className="grid grid-cols-4 gap-3 p-3 bg-background border border-border rounded-lg">
                  <Input
                    value={show.date}
                    onChange={(e) => handleUpdateShow(show.id, 'date', e.target.value)}
                    placeholder="Date & Time (e.g., March 15, 8:00 PM)"
                  />
                  <Input
                    value={show.venue}
                    onChange={(e) => handleUpdateShow(show.id, 'venue', e.target.value)}
                    placeholder="Venue"
                  />
                  <Input
                    value={show.location}
                    onChange={(e) => handleUpdateShow(show.id, 'location', e.target.value)}
                    placeholder="Location"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={show.link}
                      onChange={(e) => handleUpdateShow(show.id, 'link', e.target.value)}
                      placeholder="Link"
                    />
                    <button
                      onClick={() => handleDeleteShow(show.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {shows.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No shows added yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-bold text-primary mb-2">Hero Section Video Rules:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiple videos allowed for hero section carousel</li>
                <li>• Total file size limit: 30MB for all videos combined</li>
                <li>• Videos will auto-rotate in hero section</li>
                <li>• Use YouTube embed URLs for best performance</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Video Gallery</h3>
              <Button onClick={handleAddVideo} size="sm" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
            
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="grid grid-cols-3 gap-3 p-3 bg-background border border-border rounded-lg">
                  <Input
                    value={video.title}
                    onChange={(e) => handleUpdateVideo(video.id, 'title', e.target.value)}
                    placeholder="Title"
                  />
                  <Input
                    value={video.embedUrl || ''}
                    onChange={(e) => handleUpdateVideo(video.id, 'embedUrl', e.target.value)}
                    placeholder="YouTube Embed URL"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={video.thumbnail}
                      onChange={(e) => handleUpdateVideo(video.id, 'thumbnail', e.target.value)}
                      placeholder="Thumbnail URL"
                    />
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No videos added yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-bold text-primary mb-2">Real-Time Sales Tracking:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Sales:</span>
                  <span className="ml-2 font-bold text-foreground">${products.reduce((sum, p) => sum + (p.sales || 0) * p.price, 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Units Sold:</span>
                  <span className="ml-2 font-bold text-foreground">{products.reduce((sum, p) => sum + (p.sales || 0), 0)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="ml-2 font-bold text-foreground">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Printful Products</h3>
              <Button onClick={handleAddProduct} size="sm" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
            
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="grid grid-cols-6 gap-3 p-3 bg-background border border-border rounded-lg">
                  <Input
                    value={product.name}
                    onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)}
                    placeholder="Product Name"
                  />
                  <Input
                    value={product.price}
                    type="number"
                    onChange={(e) => handleUpdateProduct(product.id, 'price', parseFloat(e.target.value))}
                    placeholder="Price"
                  />
                  <Input
                    value={product.image}
                    onChange={(e) => handleUpdateProduct(product.id, 'image', e.target.value)}
                    placeholder="Image URL"
                  />
                  <Input
                    value={product.printfulUrl || ''}
                    onChange={(e) => handleUpdateProduct(product.id, 'printfulUrl', e.target.value)}
                    placeholder="Printful URL"
                  />
                  <Input
                    value={product.category}
                    onChange={(e) => handleUpdateProduct(product.id, 'category', e.target.value)}
                    placeholder="Category"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products added yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add products with Printful links to display on the shop page.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-bold text-primary mb-2">Real-Time Donation Tracking:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Donations:</span>
                  <span className="ml-2 font-bold text-foreground">${donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Number of Donors:</span>
                  <span className="ml-2 font-bold text-foreground">{donations.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="ml-2 font-bold text-foreground">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <h3 className="font-bold text-lg">Donation History</h3>
            
            <div className="space-y-3">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                    <div>
                      <p className="font-bold">${donation.amount}</p>
                      <p className="text-sm text-muted-foreground">{donation.date}</p>
                      {donation.donor && <p className="text-sm">From: {donation.donor}</p>}
                    </div>
                    {donation.message && (
                      <p className="text-sm text-muted-foreground italic">&quot;{donation.message}&quot;</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No donations recorded yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Donations made through Cash App will appear here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-bold text-primary mb-2">Photo Management:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manage closing section polaroid photos</li>
                <li>• Add donation widget image</li>
                <li>• Update hero section images</li>
                <li>• Photos appear in real-time on website</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Photo Gallery</h3>
              <Button onClick={handleAddPhoto} size="sm" className="btn-primary min-h-[44px] px-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </div>
            
            <div className="space-y-3">
              {photos.map((photo) => (
                <div key={photo.id} className="grid grid-cols-3 gap-3 p-3 bg-background border border-border rounded-lg">
                  <Input
                    value={photo.title}
                    onChange={(e) => handleUpdatePhoto(photo.id, 'title', e.target.value)}
                    placeholder="Photo Title"
                  />
                  <Input
                    value={photo.url}
                    onChange={(e) => handleUpdatePhoto(photo.id, 'url', e.target.value)}
                    placeholder="Image URL"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {photos.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No photos added yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h3 className="font-bold text-lg">Update Credentials</h3>
            
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="newUsername">New Username</Label>
                <Input
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              
              <Button onClick={handleUpdateCredentials} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-bold mb-2">Keyboard Shortcut</h4>
              <p className="text-sm text-muted-foreground">
                Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> +{' '}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> +{' '}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd> to quickly open admin
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
