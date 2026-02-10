'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CopyTrade {
  id: string;
  masterId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  masterQty: number;
  followerQty: number;
  price: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';
  timestamp: string;
  reason?: string;
}

export function FollowerCopyTradesBoard() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<CopyTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCopyTrades = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/followers/copy-trades?followerId=${encodeURIComponent(user.id)}`);
        const data = await response.json();
        
        if (data.ok && Array.isArray(data.trades)) {
          setTrades(data.trades);
        }
      } catch (error) {
        console.error('Failed to fetch copy trades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCopyTrades();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchCopyTrades, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSideColor = (side: string) => {
    return side === 'BUY' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Copy Trading Dashboard</h2>
        <p className="text-muted-foreground">
          Live trades copied from master account ({user?.id})
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Copied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {trades.filter(t => t.status === 'SUCCESS').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {trades.filter(t => t.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {trades.filter(t => t.status === 'FAILED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Copy Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Live Copy Trades
          </CardTitle>
          <CardDescription>
            Orders copied from master in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading trades...</p>
            </div>
          ) : trades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-muted-foreground">No copy trades yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Orders will appear here when master places trades
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Symbol</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Master Qty</TableHead>
                    <TableHead>Your Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge className={getSideColor(trade.side)}>
                          {trade.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{trade.masterQty}</TableCell>
                      <TableCell className="font-mono text-sm font-bold">
                        {trade.followerQty}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        ₹{trade.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(trade.status)}>
                          {trade.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">📊 How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900">
          <p>✅ Master places a trade on their AliceBlue account</p>
          <p>✅ System calculates your quantity based on multiplier</p>
          <p>✅ Order is placed on your account automatically</p>
          <p>✅ Status updates appear here in real-time</p>
          <p>✅ Risk limits are enforced before placement</p>
        </CardContent>
      </Card>
    </div>
  );
}
