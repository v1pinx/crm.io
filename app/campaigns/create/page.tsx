'use client'
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Users, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Segment, Rule } from "@/types";
import { processNaturalLanguage } from "@/lib/nlp";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type ExtendedUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  _id?: string;
};


export default function CreateCampaignPage() {
    const { data: session, status } = useSession();
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [segment, setSegment] = useState<Segment>({
        name: "",
        description: "",
        rules: [{ id: "1", field: "totalSpent", operator: ">", value: "", connector: "AND" }],
    })
    const [message, setMessage] = useState("")
    const [audienceSize, setAudienceSize] = useState(0)
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)
    const [nlQuery, setNlQuery] = useState("")
    const [isProcessingNL, setIsProcessingNL] = useState(false)

    useEffect(() => {
        const fetchAudienceSize = async () => {
            const response = await axios.post("/api/audience-size", { segment });
            setAudienceSize(response.data.size);
        }
        fetchAudienceSize();
    }, [segment.rules])

    const addRule = () => {
        const newRule: Rule = {
            id: Date.now().toString(),
            field: "totalSpent",
            operator: ">",
            value: "",
            connector: "AND",
        }
        setSegment((prev) => ({
            ...prev,
            rules: [...prev.rules, newRule],
        }))
    }

    const removeRule = (ruleId: string) => {
        setSegment((prev) => ({
            ...prev,
            rules: prev.rules.filter((rule) => rule.id !== ruleId),
        }))
    }

    const updateRule = (ruleId: string, field: keyof Rule, value: string) => {
        setSegment((prev) => ({
            ...prev,
            rules: prev.rules.map((rule) => (rule.id === ruleId ? { ...rule, [field]: value } : rule)),
        }))
    }

    const generateAIMessage = async () => {
        setIsGeneratingMessage(true)

        // Have to use Gemini-API
        const messages = [
            "Hi {name}, we've got something special just for you! 🎉",
            "Hey {name}, don't miss out on this exclusive offer!",
            "Hello {name}, we think you'll love what we have in store!",
            "{name}, your personalized deal is waiting for you!",
        ]

        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        setMessage(randomMessage)
        setIsGeneratingMessage(false)
    }

    const handleSubmit = async () => {
        if (!segment.name || !message || segment.rules.length === 0) {
            toast.error("Please fill in all required fields");
            return;
        }

        const audienceListResponse = await axios.post("/api/audience-list", { segment });
        if (!audienceListResponse.data || audienceListResponse.data.size === 0) {
            toast.error("No audience matches the selected criteria")
            return;
        }

        const user = session?.user as ExtendedUser;

        const campaignData = {
            name: segment.name,
            description: segment.description,
            audience: audienceSize,
            message: message,
            createdAt: new Date().toISOString(),
            audienceList: audienceListResponse.data.audienceList,
            createdBy: user?._id, 
        }

        try {
            const response = await axios.post("/api/campaigns", campaignData);
            if (response.status === 201) {
                toast.success("Campaign created successfully!")
                window.location.href = "/campaigns";
            } else {
                toast.error("Failed to create campaign")
            }
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast.error("An error occurred while creating the campaign. Please try again later.");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/campaigns" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-200 group">
                        <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                            Create Campaign
                        </h1>
                        <p className="text-gray-600 mt-1">Build and launch your targeted marketing campaign</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Campaign Details */}
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign Details</h2>
                            <p className="text-gray-600">Set up your campaign name and description</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="campaign-name" className="text-sm font-medium text-gray-700 mb-2 block">Campaign Name *</Label>
                                <Input
                                    id="campaign-name"
                                    placeholder="e.g., Holiday Sale - High Value Customers"
                                    value={segment.name}
                                    onChange={(e) => setSegment((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <Label htmlFor="campaign-description" className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                                <Textarea
                                    id="campaign-description"
                                    placeholder="Describe your campaign objective and target audience"
                                    value={segment.description}
                                    onChange={(e) => setSegment((prev) => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI-Powered Natural Language Segment Builder */}
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-lg flex items-center justify-center mr-3">
                                    <Wand2 className="h-4 w-4 text-emerald-600" />
                                </div>
                                AI-Powered Segment Builder
                            </h2>
                            <p className="text-gray-600">Describe your target audience in plain English and let AI create the rules</p>
                        </div>
                        <div>
                            <Label htmlFor="nl-query" className="text-sm font-medium text-gray-700 mb-2 block">Natural Language Query</Label>
                            <div className="flex space-x-3">
                                <Input
                                    id="nl-query"
                                    placeholder="e.g., People who haven't shopped in 6 months and spent over ₹5K"
                                    value={nlQuery}
                                    onChange={(e) => setNlQuery(e.target.value)}
                                    className="flex-1 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all duration-200"
                                />
                                <Button
                                    onClick={() => processNaturalLanguage({ nlQuery, setSegment, setIsProcessingNL, setNlQuery })}
                                    disabled={isProcessingNL || !nlQuery.trim()}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                                >
                                    {isProcessingNL ? "Processing..." : "Generate Rules"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Audience Segmentation */}
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Audience Segmentation</h2>
                            <p className="text-gray-600">Define your target audience using flexible rule logic</p>
                        </div>
                        <div className="space-y-4">
                            {segment.rules.map((rule, index) => (
                                <div key={rule.id} className="space-y-3">
                                    {index > 0 && (
                                        <div className="flex items-center">
                                            <Select value={rule.connector} onValueChange={(value) => updateRule(rule.id, "connector", value)}>
                                                <SelectTrigger className="w-20 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AND">AND</SelectItem>
                                                    <SelectItem value="OR">OR</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        <Select value={rule.field} onValueChange={(value) => updateRule(rule.id, "field", value)}>
                                            <SelectTrigger className="w-40 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="totalSpent">Total Spent</SelectItem>
                                                <SelectItem value="visits">Visit Count</SelectItem>
                                                <SelectItem value="lastVisit">Last Visit</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={rule.operator} onValueChange={(value) => updateRule(rule.id, "operator", value)}>
                                            <SelectTrigger className="w-20 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value=">">{">"}</SelectItem>
                                                <SelectItem value="<">{"<"}</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            placeholder="Value"
                                            value={rule.value}
                                            onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                                            className="w-32 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all duration-200"
                                        />

                                        {segment.rules.length > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeRule(rule.id)}
                                                className="border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                onClick={addRule}
                                className="border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Rule
                            </Button>

                            {/* Audience Preview */}
                            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 p-4 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-lg flex items-center justify-center">
                                        <Users className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <span className="font-medium text-emerald-900">Estimated Audience Size:</span>
                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-full px-3 py-1">
                                        {audienceSize.toLocaleString()} customers
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Creation */}
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Message Template</h2>
                                    <p className="text-gray-600">Create a personalized message for your audience. Use {"{name}"} for personalization.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateAIMessage}
                                    disabled={isGeneratingMessage}
                                    className="border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center"
                                >
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    {isGeneratingMessage ? "Generating..." : "AI Generate"}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">Message Template *</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Hi {name}, here's 10% off on your next order!"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={3}
                                    className="w-full bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all duration-200"
                                />
                            </div>

                            {message && (
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl">
                                    <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
                                    <p className="text-sm text-gray-800">{message.replace("{name}", "John Doe")}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="outline" asChild className="border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 px-6 py-2">
                            <Link href="/campaigns">Cancel</Link>
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Launch Campaign
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}