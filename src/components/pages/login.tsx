/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Activity } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function LoginPage() {
    const { login, register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [registerForm, setRegisterForm] = useState({
        full_name: '',
        personal_id: '',
        birth_date: '',
        gender: '', // "Male" | "Female" | "Other"
        phone: '',
        address: '',
        email: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(loginForm.email, loginForm.password);
            if (success) {
                toast.success('Login successful!');
            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await register(registerForm);
            if (success) {
                toast.success('Registration successful! Welcome to MediCare.');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        toast.info('Google Sign-In would be integrated with your authentication provider');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Activity className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900">MediCare Portal</h1>
                    <p className="text-gray-600">Your health, simplified</p>
                </div>

                <Card>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <CardHeader>
                                <CardTitle>Welcome back</CardTitle>
                                <CardDescription>
                                    Enter your credentials to access your patient portal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john.smith@email.com"
                                            value={loginForm.email}
                                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={loginForm.password}
                                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </form>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Demo credentials: mai.le@gmail.com / 123456
                                </p>
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="register">
                            <CardHeader>
                                <CardTitle>Create Account</CardTitle>
                                <CardDescription>
                                    Join MediCare to manage your healthcare journey
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="full_name">Full Name</Label>
                                            <Input
                                                id="full_name"
                                                placeholder="John Smith"
                                                value={registerForm.full_name}
                                                onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="personal_id">Personal ID</Label>
                                            <Input
                                                id="personal_id"
                                                placeholder="ID123456789"
                                                value={registerForm.personal_id}
                                                onChange={(e) => setRegisterForm({ ...registerForm, personal_id: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="birth_date">Birth Date</Label>
                                            <Input
                                                id="birth_date"
                                                type="date"
                                                value={registerForm.birth_date}
                                                onChange={(e) => setRegisterForm({ ...registerForm, birth_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select onValueChange={(value) => setRegisterForm({ ...registerForm, gender: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="+1 (555) 123-4567"
                                            value={registerForm.phone}
                                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            placeholder="123 Main Street, City, State"
                                            value={registerForm.address}
                                            onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg_email">Email</Label>
                                        <Input
                                            id="reg_email"
                                            type="email"
                                            placeholder="john.smith@email.com"
                                            value={registerForm.email}
                                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg_password">Password</Label>
                                        <Input
                                            id="reg_password"
                                            type="password"
                                            placeholder="Create a strong password"
                                            value={registerForm.password}
                                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* <div className="border-t pt-4">
                                        <h4 className="font-medium mb-3">Insurance Information (Optional)</h4>
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="insurance_provider">Insurance Provider</Label>
                                                <Input
                                                    id="insurance_provider"
                                                    placeholder="Blue Cross Blue Shield"
                                                    value={registerForm.insurance_provider}
                                                    onChange={(e) => setRegisterForm({ ...registerForm, insurance_provider: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="policy_number">Policy Number</Label>
                                                    <Input
                                                        id="policy_number"
                                                        placeholder="BC12345678"
                                                        value={registerForm.policy_number}
                                                        onChange={(e) => setRegisterForm({ ...registerForm, policy_number: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="insurance_validity">Valid Until</Label>
                                                    <Input
                                                        id="insurance_validity"
                                                        type="date"
                                                        value={registerForm.insurance_validity}
                                                        onChange={(e) => setRegisterForm({ ...registerForm, insurance_validity: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </form>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}