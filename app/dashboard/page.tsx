'use client'
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, TrendingUp, TruckElectric, Users, Users2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalCampaigns: 0,
        messageSent: 0,
        deliverySent: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const totalCustomers = await axios.get('/api/customers/count');
                const campaigns = await axios.get('/api/campaigns');
                const messageSent = campaigns.data.reduce((acc: any, campaign: any) => acc + campaign.sent, 0);
                const avgDeliveryRate = Math.round(campaigns.data.reduce((sum: any, c: any) => sum + c.deliveryRate, 0) / campaigns.data.length);

                setStats({
                    totalCustomers: totalCustomers.data.count,
                    totalCampaigns: campaigns.data.length,
                    messageSent: messageSent,
                    deliverySent: avgDeliveryRate
                })
            } catch (error) {
                console.error("Error fetching stats:", error);
            }

        }
        fetchStats();
    }, [])

    return (
        <div className="min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-200 group">
                    <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1"></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-colors">
                            <Users2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-colors">
                            <MessageSquare className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-colors">
                            <TrendingUp className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Message Sent</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.messageSent}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-colors">
                            <TruckElectric className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.deliverySent}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                    <p className="text-sm text-gray-500 mb-5">Build audience segments and launch personalized campaigns</p>
                    <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 py-5 cursor-pointer">
                        <Link href="/campaigns/create">Create Campaign</Link>
                    </Button>
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                    <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
                    <p className="text-sm text-gray-500 mb-5">Import customer data and manage your database</p>
                    <Link href="/manage-data" ><Button variant="outline" className="w-full py-5 cursor-pointer">
                        Manage Data</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}