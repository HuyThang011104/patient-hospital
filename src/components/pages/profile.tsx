/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { User, Shield, Key, Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function Profile() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [profileForm, setProfileForm] = useState({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        gender: user?.gender || '',
        insurance_provider: user?.insurance_provider || '',
        policy_number: user?.policy_number || '',
        insurance_validity: user?.insurance_validity || ''
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const success = await updateProfile(profileForm);
            if (success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred while updating profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = () => {
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordForm.new_password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        // In a real app, this would call an API
        toast.success('Password changed successfully!');
        setShowPasswordDialog(false);
        setPasswordForm({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div>
                <h1>Hồ Sơ Cá Nhân</h1>
                <p className="text-muted-foreground">Quản lý thông tin cá nhân và cài đặt của bạn</p>
            </div>

            {/* Profile Overview */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{user?.full_name}</CardTitle>
                                <CardDescription>{user?.email}</CardDescription>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Patient ID: {user?.personal_id}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsEditing(!isEditing)}
                            variant={isEditing ? "outline" : "default"}
                            className={isEditing ? "" : "bg-blue-600 hover:bg-blue-700"}
                        >
                            {isEditing ? 'Hủy Bỏ' : 'Chỉnh Sửa Hồ Sơ'}
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Thông Tin Cá Nhân
                        </CardTitle>
                        <CardDescription>Thông tin cá nhân cơ bản của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Họ và Tên</Label>
                                <Input
                                    id="full_name"
                                    value={profileForm.full_name}
                                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="personal_id">CMND/CCCD</Label>
                                <Input
                                    id="personal_id"
                                    value={user?.personal_id || ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Số Điện Thoại</Label>
                                <Input
                                    id="phone"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birth_date">Ngày Sinh</Label>
                                <Input
                                    id="birth_date"
                                    value={user?.birth_date || ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age">Tuổi</Label>
                                <Input
                                    id="age"
                                    value={user?.birth_date ? `${calculateAge(user.birth_date)} tuổi` : ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Giới Tính</Label>
                                <Select
                                    value={profileForm.gender}
                                    onValueChange={(value) => setProfileForm({ ...profileForm, gender: value })}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn giới tính" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Nam</SelectItem>
                                        <SelectItem value="Female">Nữ</SelectItem>
                                        <SelectItem value="Other">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Địa Chỉ</Label>
                            <Input
                                id="address"
                                value={profileForm.address}
                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        {isEditing && (
                            <div className="pt-4">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Insurance Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Bảo Hiểm
                        </CardTitle>
                        <CardDescription>Thông tin bảo hiểm của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="insurance_provider">Nhà Cung Cấp Bảo Hiểm</Label>
                            <Input
                                id="insurance_provider"
                                value={profileForm.insurance_provider}
                                onChange={(e) => setProfileForm({ ...profileForm, insurance_provider: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Bảo hiểm Việt Nam"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="policy_number">Số Hợp Đồng</Label>
                            <Input
                                id="policy_number"
                                value={profileForm.policy_number}
                                onChange={(e) => setProfileForm({ ...profileForm, policy_number: e.target.value })}
                                disabled={!isEditing}
                                placeholder="BH12345678"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="insurance_validity">Hiệu Lực Đến Ngày</Label>
                            <Input
                                id="insurance_validity"
                                type="date"
                                value={profileForm.insurance_validity}
                                onChange={(e) => setProfileForm({ ...profileForm, insurance_validity: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        {user?.insurance_provider && (
                            <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700">
                                    ✓ Bảo hiểm có hiệu lực
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Cài Đặt Bảo Mật
                    </CardTitle>
                    <CardDescription>Quản lý bảo mật tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">Mật Khẩu</h4>
                                <p className="text-sm text-muted-foreground">
                                    Thay đổi lần cuối: Chưa (Tài khoản demo)
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowPasswordDialog(true)}
                            >
                                Đổi Mật Khẩu
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">Xác Thực Hai Yếu Tố</h4>
                                <p className="text-sm text-muted-foreground">
                                    Thêm một lớp bảo mật bổ sung cho tài khoản của bạn
                                </p>
                            </div>
                            <Button variant="outline" disabled>
                                Bật 2FA
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Đổi Mật Khẩu</DialogTitle>
                        <DialogDescription>
                            Nhập mật khẩu hiện tại và chọn mật khẩu mới
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current_password">Current Password</Label>
                            <Input
                                id="current_password"
                                type="password"
                                value={passwordForm.current_password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input
                                id="new_password"
                                type="password"
                                value={passwordForm.new_password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                            <Input
                                id="confirm_password"
                                type="password"
                                value={passwordForm.confirm_password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Password must be at least 6 characters long
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Change Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}