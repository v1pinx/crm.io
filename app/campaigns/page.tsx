'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, MessageSquare, Search, Users, Eye, Copy, TrendingUp } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('/api/campaigns');
                setCampaigns(response.data);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };

        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(
        (campaign: any) =>
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const totalAudience = campaigns.reduce((sum: any, c: any) => sum + c.audience, 0);
    const avgDeliveryRate = Math.round(campaigns.reduce((sum: any, c: any) => sum + c.deliveryRate, 0) / campaigns.length);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8'>
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-200 group">
                            <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                                Campaign History
                            </h1>
                            <p className="text-gray-600 mt-1">Manage and track your marketing campaigns</p>
                        </div>
                    </div>
                    <Link href="campaigns/create">
                        <Button className=' bg-emerald-500 cursor-pointer hover:bg-emerald-600 text-white px-4 py-5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md'>
                            Create New Campaign
                        </Button>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all duration-200 placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-colors">
                                <MessageSquare className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-colors">
                                <Users className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Audience</p>
                                <p className="text-2xl font-bold text-gray-900">{totalAudience.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-colors">
                                <TrendingUp className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg. Delivery Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{avgDeliveryRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaigns List */}
                <div className="space-y-3">
                    {filteredCampaigns.map((campaign: any) => (
                        <div key={campaign._id} className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-all duration-200 group">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                            {campaign.name}
                                        </h3>
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{campaign.description}</p>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900">{campaign.audience.toLocaleString()}</p>
                                        <p className="text-gray-500 text-xs">Audience</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-emerald-600">{campaign.sent.toLocaleString()}</p>
                                        <p className="text-gray-500 text-xs">Sent</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-cyan-600">{campaign.deliveryRate}%</p>
                                        <p className="text-gray-500 text-xs">Success</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCampaigns.length === 0 && (
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchTerm ? "Try adjusting your search terms to find what you're looking for." : "Get started by creating your first campaign to reach your audience."}
                        </p>
                        <button className="bg-gradient-to-r bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                            Create Your First Campaign
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}