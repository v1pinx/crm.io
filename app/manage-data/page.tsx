"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Database, Users, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link";
import axios from "axios";

interface ApiResponse {
  success: boolean
  message: string
}

export default function DataManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [customerData, setCustomerData] = useState("")
  const [orderData, setOrderData] = useState("")
  const [apiResponses, setApiResponses] = useState<ApiResponse[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [databaseStats, setDatabaseStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    activeCampaigns: 0,
    messagesSent: 0,
  });

  useEffect(() => {

    const fetchDatabaseStats = async () => {
      try {
        const totalCustomers = await axios.get("/api/customers/count");
        const totalOrders = await axios.get("/api/orders/count");
        setDatabaseStats({
          totalCustomers: totalCustomers.data.count || 0,
          totalOrders: totalOrders.data.count || 0,
          activeCampaigns: databaseStats.activeCampaigns,
          messagesSent: databaseStats.messagesSent,
        });
      }
      catch (error) {
        console.error("Failed to fetch database stats:", error);
      }
    }

    fetchDatabaseStats();

  }, []);

  //   useEffect(() => {
  //     const authStatus = localStorage.getItem("isAuthenticated")
  //     if (authStatus !== "true") {
  //       window.location.href = "/"
  //       return
  //     }
  //     setIsAuthenticated(true)
  //   }, [])

  const handleCustomerSubmit = async () => {
    if (!customerData.trim()) return;

    setIsLoading(true);

    try {
      if (!customerData.startsWith("[")) {
        setIsLoading(false);
        return setApiResponses((prev) => [
          {
            success: false,
            message: "Invalid JSON format. Data should be an array of objects.",
          },
          ...prev,
        ]);
      }

      const parsedData = JSON.parse(customerData);
      const response = await axios.post("/api/customers/bulk", parsedData);


      setApiResponses((prev) => [
        {
          success: true,
          message: "Customers added successfully"
        },
        ...prev,
      ]);

      setCustomerData("");
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message:
          error.response?.data?.error || "Failed to ingest customer data",
      };
      setApiResponses((prev) => [response, ...prev]);
    }

    setIsLoading(false);
  };


  const handleOrderSubmit = async () => {
    if (!orderData.trim()) return;

    setIsLoading(true);

    try {
      // Validate JSON format
      if (!orderData.startsWith("[")) {
        throw new Error("Invalid JSON format. Data should be an array of objects.");
      }

      const parsedData = JSON.parse(orderData);
      const response = await axios.post("/api/orders/bulk", parsedData);

      // You can adjust based on your backend response format
      const apiResponse: ApiResponse = {
        success: true,
        message: response.data?.message || "Order data ingested successfully",
      };

      setApiResponses((prev: any) => [apiResponse, ...prev]);
      setOrderData("");
    } catch (error: any) {
      const apiResponse: ApiResponse = {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to ingest order data",
      };
      setApiResponses((prev) => [apiResponse, ...prev]);
    }

    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/campaigns" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-200 group">
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Data Management
          </h1>
          <p className="text-gray-600 mt-1">Import customer and order data using our secure REST APIs</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Ingestion */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Ingestion APIs
                </CardTitle>

              </CardHeader>
              <CardContent>
                <Tabs defaultValue="customers" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customers" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Orders
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="customers" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-data">Customer Data (JSON)</Label>
                      <Textarea
                        id="customer-data"
                        placeholder={`[
  {
    "id": "654f1b2c-1234-4567-8901-23456789abcd",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "totalSpent": 15000,
    "lastVisit": "2024-01-15",
    "visits": 5,
    "createdAt": "2023-06-15"
  }
]`}
                        value={customerData}
                        onChange={(e) => setCustomerData(e.target.value)}
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleCustomerSubmit}
                      disabled={isLoading || !customerData.trim()}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isLoading ? "Ingesting..." : "Ingest Customer Data"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="order-data">Order Data (JSON)</Label>
                      <Textarea
                        id="order-data"
                        placeholder={`[
  { 
    "id": "12345678-1234-5678-9012-34567890abcd",                      
    "customerId": "654f1b2c-1234-4567-8901-23456789abcd",
    "amount": 2500,
    "status": "completed",
    "items": [
      {
        "productId": "prod_123",
        "name": "Wireless Headphones",
        "quantity": 1,
        "price": 2500
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]`}
                        value={orderData}
                        onChange={(e) => setOrderData(e.target.value)}
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button onClick={handleOrderSubmit} disabled={isLoading || !orderData.trim()} className="w-full bg-emerald-500 hover:bg-emerald-600 ">
                      <Upload className="h-4 w-4 mr-2" />
                      {isLoading ? "Ingesting..." : "Ingest Order Data"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* API Documentation & Responses */}
          <div className="space-y-6">


            {/* Recent API Responses */}
            <Card>
              <CardHeader>
                <CardTitle>Recent API Responses</CardTitle>
                <CardDescription>Latest ingestion results and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {apiResponses.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No API calls made yet</p>
                  ) : (
                    apiResponses.map((response, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          {response.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${response.success ? "text-green-800" : "text-red-800"}`}
                          >
                            {response.success ? "Success" : "Error"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{response.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Database Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Database Statistics</CardTitle>
                <CardDescription>Current data overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Customers</span>
                  <Badge variant="outline">{databaseStats.totalCustomers}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <Badge variant="outline">{databaseStats.totalOrders}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
