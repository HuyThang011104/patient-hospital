import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Plus, Search, Filter, Pill, Wrench, AlertTriangle, Edit, Trash2, Package } from 'lucide-react';

const medicinesData = [
    {
        id: 1,
        name: 'Amoxicillin',
        description: 'Antibiotic for bacterial infections',
        quantity: 45,
        price: 15.99,
        expiryDate: '2024-12-15',
        category: 'Antibiotic',
        supplier: 'PharmaCorp'
    },
    {
        id: 2,
        name: 'Paracetamol',
        description: 'Pain reliever and fever reducer',
        quantity: 120,
        price: 8.50,
        expiryDate: '2025-06-20',
        category: 'Analgesic',
        supplier: 'MedSupply'
    },
    {
        id: 3,
        name: 'Insulin',
        description: 'Diabetes medication',
        quantity: 25,
        price: 45.00,
        expiryDate: '2024-04-10',
        category: 'Hormone',
        supplier: 'DiabetesCare'
    },
    {
        id: 4,
        name: 'Lisinopril',
        description: 'Blood pressure medication',
        quantity: 8,
        price: 22.75,
        expiryDate: '2024-08-30',
        category: 'Cardiovascular',
        supplier: 'CardioMed'
    },
    {
        id: 5,
        name: 'Ibuprofen',
        description: 'Anti-inflammatory pain reliever',
        quantity: 75,
        price: 12.25,
        expiryDate: '2025-03-15',
        category: 'NSAID',
        supplier: 'PainRelief Inc'
    }
];

const equipmentData = [
    {
        id: 1,
        name: 'MRI Scanner #1',
        description: 'Magnetic Resonance Imaging machine',
        quantity: 1,
        location: 'Radiology Department',
        status: 'Available',
        lastMaintenance: '2024-02-15',
        nextMaintenance: '2024-05-15'
    },
    {
        id: 2,
        name: 'X-Ray Machine #2',
        description: 'Digital X-Ray imaging system',
        quantity: 1,
        location: 'Emergency Department',
        status: 'In Use',
        lastMaintenance: '2024-01-20',
        nextMaintenance: '2024-04-20'
    },
    {
        id: 3,
        name: 'Ventilator #3',
        description: 'Mechanical ventilator for ICU',
        quantity: 1,
        location: 'ICU',
        status: 'Maintenance',
        lastMaintenance: '2024-03-01',
        nextMaintenance: '2024-03-20'
    },
    {
        id: 4,
        name: 'Ultrasound Machine',
        description: 'Portable ultrasound device',
        quantity: 2,
        location: 'Cardiology',
        status: 'Available',
        lastMaintenance: '2024-02-28',
        nextMaintenance: '2024-05-28'
    },
    {
        id: 5,
        name: 'Defibrillator',
        description: 'Emergency cardiac defibrillator',
        quantity: 4,
        location: 'Emergency Department',
        status: 'Available',
        lastMaintenance: '2024-03-05',
        nextMaintenance: '2024-06-05'
    }
];

export function Pharmacy() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isAddMedicineDialogOpen, setIsAddMedicineDialogOpen] = useState(false);
    const [isAddEquipmentDialogOpen, setIsAddEquipmentDialogOpen] = useState(false);

    const filteredMedicines = medicinesData.filter(medicine => {
        const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || medicine.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const filteredEquipment = equipmentData.filter(equipment => {
        const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipment.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || equipment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const isExpiringSoon = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
        return daysUntilExpiry <= 90; // Within 90 days
    };

    const isExpired = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return expiry < today;
    };

    const getExpiryBadge = (expiryDate: string) => {
        if (isExpired(expiryDate)) {
            return <Badge variant="destructive">Expired</Badge>;
        } else if (isExpiringSoon(expiryDate)) {
            return <Badge variant="secondary">Expiring Soon</Badge>;
        }
        return <Badge variant="default">Valid</Badge>;
    };

    const getStockBadge = (quantity: number, threshold: number = 20) => {
        if (quantity === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        } else if (quantity <= threshold) {
            return <Badge variant="secondary">Low Stock</Badge>;
        }
        return <Badge variant="default">In Stock</Badge>;
    };

    const getStatusBadge = (status: string) => {
        const variant = status === 'Available' ? 'default' :
            status === 'In Use' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
    };

    const categories = [...new Set(medicinesData.map(med => med.category))];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Pharmacy & Equipment</h1>
                    <p className="text-muted-foreground">
                        Manage medicines inventory and medical equipment
                    </p>
                </div>
            </div>

            <Tabs defaultValue="medicines" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="medicines" className="flex items-center">
                        <Pill className="mr-2 h-4 w-4" />
                        Medicines
                    </TabsTrigger>
                    <TabsTrigger value="equipment" className="flex items-center">
                        <Wrench className="mr-2 h-4 w-4" />
                        Equipment
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="medicines">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                <CardTitle className="flex items-center">
                                    <Package className="mr-2 h-5 w-5" />
                                    Medicine Inventory
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search medicines..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 w-64"
                                        />
                                    </div>
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-40">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Categories</SelectItem>
                                            {categories.map(category => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Dialog open={isAddMedicineDialogOpen} onOpenChange={setIsAddMedicineDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Medicine
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Medicine</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid grid-cols-2 gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="medicineName">Medicine Name</Label>
                                                    <Input id="medicineName" placeholder="Enter medicine name" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Category</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="antibiotic">Antibiotic</SelectItem>
                                                            <SelectItem value="analgesic">Analgesic</SelectItem>
                                                            <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                                                            <SelectItem value="hormone">Hormone</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Input id="description" placeholder="Enter description" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity">Quantity</Label>
                                                    <Input id="quantity" type="number" placeholder="Enter quantity" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="price">Price ($)</Label>
                                                    <Input id="price" type="number" step="0.01" placeholder="Enter price" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiryDate">Expiry Date</Label>
                                                    <Input id="expiryDate" type="date" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="supplier">Supplier</Label>
                                                    <Input id="supplier" placeholder="Enter supplier name" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" onClick={() => setIsAddMedicineDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={() => setIsAddMedicineDialogOpen(false)}>
                                                    Add Medicine
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Medicine Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Expiry Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMedicines.map((medicine) => (
                                            <TableRow key={medicine.id}>
                                                <TableCell className="font-medium">{medicine.name}</TableCell>
                                                <TableCell className="max-w-40 truncate">{medicine.description}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{medicine.category}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <span>{medicine.quantity}</span>
                                                        {medicine.quantity <= 20 && (
                                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>${medicine.price}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <span>{medicine.expiryDate}</span>
                                                        {isExpiringSoon(medicine.expiryDate) && (
                                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {getStockBadge(medicine.quantity)}
                                                        {getExpiryBadge(medicine.expiryDate)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="equipment">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                <CardTitle className="flex items-center">
                                    <Wrench className="mr-2 h-5 w-5" />
                                    Medical Equipment
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search equipment..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 w-64"
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-32">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Status</SelectItem>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="In Use">In Use</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Dialog open={isAddEquipmentDialogOpen} onOpenChange={setIsAddEquipmentDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Equipment
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Equipment</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid grid-cols-2 gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="equipmentName">Equipment Name</Label>
                                                    <Input id="equipmentName" placeholder="Enter equipment name" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="equipmentQuantity">Quantity</Label>
                                                    <Input id="equipmentQuantity" type="number" placeholder="Enter quantity" />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label htmlFor="equipmentDescription">Description</Label>
                                                    <Input id="equipmentDescription" placeholder="Enter description" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="location">Location</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select location" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="radiology">Radiology Department</SelectItem>
                                                            <SelectItem value="emergency">Emergency Department</SelectItem>
                                                            <SelectItem value="icu">ICU</SelectItem>
                                                            <SelectItem value="cardiology">Cardiology</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="equipmentStatus">Status</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="available">Available</SelectItem>
                                                            <SelectItem value="in-use">In Use</SelectItem>
                                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                                                    <Input id="lastMaintenance" type="date" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                                                    <Input id="nextMaintenance" type="date" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" onClick={() => setIsAddEquipmentDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={() => setIsAddEquipmentDialogOpen(false)}>
                                                    Add Equipment
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Equipment Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Maintenance</TableHead>
                                            <TableHead>Next Maintenance</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEquipment.map((equipment) => (
                                            <TableRow key={equipment.id}>
                                                <TableCell className="font-medium">{equipment.name}</TableCell>
                                                <TableCell className="max-w-40 truncate">{equipment.description}</TableCell>
                                                <TableCell>{equipment.quantity}</TableCell>
                                                <TableCell>{equipment.location}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusBadge(equipment.status)}
                                                        {equipment.status === 'Maintenance' && (
                                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{equipment.lastMaintenance}</TableCell>
                                                <TableCell>{equipment.nextMaintenance}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}