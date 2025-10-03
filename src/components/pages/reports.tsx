import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Download, TrendingUp, Users, Activity, DollarSign, Calendar } from 'lucide-react';

const hospitalPerformanceData = [
    { month: 'Jan', patients: 1200, revenue: 45000, satisfaction: 88 },
    { month: 'Feb', patients: 1350, revenue: 52000, satisfaction: 92 },
    { month: 'Mar', patients: 1180, revenue: 48000, satisfaction: 85 },
    { month: 'Apr', patients: 1450, revenue: 58000, satisfaction: 94 },
    { month: 'May', patients: 1380, revenue: 55000, satisfaction: 90 },
    { month: 'Jun', patients: 1520, revenue: 62000, satisfaction: 93 }
];

const patientFlowData = [
    { hour: '8:00', emergency: 12, outpatient: 25, inpatient: 8 },
    { hour: '10:00', emergency: 18, outpatient: 45, inpatient: 12 },
    { hour: '12:00', emergency: 22, outpatient: 38, inpatient: 15 },
    { hour: '14:00', emergency: 15, outpatient: 42, inpatient: 10 },
    { hour: '16:00', emergency: 20, outpatient: 35, inpatient: 8 },
    { hour: '18:00', emergency: 25, outpatient: 28, inpatient: 6 },
    { hour: '20:00', emergency: 30, outpatient: 15, inpatient: 4 }
];

const doctorWorkloadData = [
    { doctor: 'Dr. Wilson', patients: 45, hours: 48, efficiency: 94 },
    { doctor: 'Dr. Davis', patients: 38, hours: 44, efficiency: 86 },
    { doctor: 'Dr. Miller', patients: 52, hours: 50, efficiency: 92 },
    { doctor: 'Dr. Garcia', patients: 35, hours: 42, efficiency: 83 },
    { doctor: 'Dr. Rodriguez', patients: 48, hours: 46, efficiency: 87 }
];

const pharmacyUsageData = [
    { category: 'Antibiotics', value: 35, color: '#8884d8' },
    { category: 'Analgesics', value: 25, color: '#82ca9d' },
    { category: 'Cardiovascular', value: 20, color: '#ffc658' },
    { category: 'Hormones', value: 12, color: '#ff7300' },
    { category: 'Others', value: 8, color: '#0088fe' }
];

const departmentStatsData = [
    { department: 'Emergency', patients: 320, avgWait: 15, satisfaction: 85 },
    { department: 'Cardiology', patients: 180, avgWait: 25, satisfaction: 92 },
    { department: 'Neurology', patients: 145, avgWait: 30, satisfaction: 88 },
    { department: 'Pediatrics', patients: 220, avgWait: 20, satisfaction: 95 },
    { department: 'Orthopedics', patients: 160, avgWait: 35, satisfaction: 90 }
];

const revenueData = [
    { month: 'Jan', consultations: 25000, procedures: 15000, pharmacy: 5000 },
    { month: 'Feb', consultations: 28000, procedures: 18000, pharmacy: 6000 },
    { month: 'Mar', consultations: 26000, procedures: 16000, pharmacy: 6000 },
    { month: 'Apr', consultations: 32000, procedures: 20000, pharmacy: 6000 },
    { month: 'May', consultations: 30000, procedures: 19000, pharmacy: 6000 },
    { month: 'Jun', consultations: 35000, procedures: 22000, pharmacy: 5000 }
];

export function Reports() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Reports & Analytics</h1>
                    <p className="text-muted-foreground">
                        Hospital performance metrics and analytics dashboard
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <Select defaultValue="last-30-days">
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last-7-days">Last 7 days</SelectItem>
                            <SelectItem value="last-30-days">Last 30 days</SelectItem>
                            <SelectItem value="last-3-months">Last 3 months</SelectItem>
                            <SelectItem value="last-year">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,080</div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">+12%</span>
                            <span>vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$320,000</div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">+8%</span>
                            <span>vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                        <Activity className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">91%</div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">+2%</span>
                            <span>vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23 min</div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <span className="text-red-600">+5%</span>
                            <span>vs last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hospital Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hospital Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={hospitalPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="patients" stackId="1" stroke="#8884d8" fill="#8884d8" />
                                <Area type="monotone" dataKey="revenue" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Patient Flow */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Patient Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={patientFlowData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="emergency" stroke="#ff7300" name="Emergency" />
                                <Line type="monotone" dataKey="outpatient" stroke="#8884d8" name="Outpatient" />
                                <Line type="monotone" dataKey="inpatient" stroke="#82ca9d" name="Inpatient" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Doctor Workload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doctor Workload Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={doctorWorkloadData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="doctor" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="patients" fill="#8884d8" name="Patients" />
                                <Bar dataKey="hours" fill="#82ca9d" name="Hours" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pharmacy Usage */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pharmacy Usage Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pharmacyUsageData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pharmacyUsageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Department Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Department</th>
                                    <th className="text-left p-2">Patients</th>
                                    <th className="text-left p-2">Avg Wait Time</th>
                                    <th className="text-left p-2">Satisfaction</th>
                                    <th className="text-left p-2">Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departmentStatsData.map((dept, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2 font-medium">{dept.department}</td>
                                        <td className="p-2">{dept.patients}</td>
                                        <td className="p-2">{dept.avgWait} min</td>
                                        <td className="p-2">{dept.satisfaction}%</td>
                                        <td className="p-2">
                                            <Badge variant={dept.satisfaction >= 90 ? 'default' : dept.satisfaction >= 85 ? 'secondary' : 'destructive'}>
                                                {dept.satisfaction >= 90 ? 'Excellent' : dept.satisfaction >= 85 ? 'Good' : 'Needs Improvement'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="consultations" stackId="a" fill="#8884d8" name="Consultations" />
                            <Bar dataKey="procedures" stackId="a" fill="#82ca9d" name="Procedures" />
                            <Bar dataKey="pharmacy" stackId="a" fill="#ffc658" name="Pharmacy" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Summary Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Top Performing Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-lg font-bold">Pediatrics</div>
                            <div className="text-sm text-muted-foreground">95% satisfaction rate</div>
                            <Badge variant="default">Excellent</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Busiest Hour</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-lg font-bold">8:00 PM</div>
                            <div className="text-sm text-muted-foreground">75 total patients</div>
                            <Badge variant="secondary">Peak Time</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Most Prescribed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-lg font-bold">Antibiotics</div>
                            <div className="text-sm text-muted-foreground">35% of prescriptions</div>
                            <Badge variant="outline">Most Used</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}