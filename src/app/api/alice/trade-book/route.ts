import { NextResponse, NextRequest } from 'next/server';
import { getAccountToken } from '@/lib/alice';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const MASTER_FILE = process.env.QUANTUM_MASTER_ACCOUNT_FILE || '.master.account';

/**
 * Fetch real-time Trade Book data from Alice Blue API
 * GET /api/alice/trade-book?accountId=<id>
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  let accountId = url.searchParams.get('accountId');

  try {
    // If no accountId provided, try to read the master account file
    if (!accountId) {
      try {
        const masterPath = path.join(process.cwd(), MASTER_FILE);
        if (fs.existsSync(masterPath)) {
          accountId = fs.readFileSync(masterPath, 'utf-8').trim();
          console.log('[TRADE-BOOK] Using master account from file:', accountId);
        }
      } catch (e) {
        console.warn('[TRADE-BOOK] Failed to read master account file:', e);
      }
    }

    // Get the saved OAuth token for this account
    const token = getAccountToken(accountId || 'Master');
    if (!token) {
      return NextResponse.json(
        { ok: false, message: 'No OAuth token found for this account' },
        { status: 401 }
      );
    }

    // Fetch Trade Book from Alice Blue API
    // Alice Blue Trade Book endpoint (adjust based on their actual API docs)
    const tradeBookEndpoint = 'https://ant.aliceblueonline.com/open-api/od/v1/trades';

    const fetchRes = await fetch(tradeBookEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!fetchRes.ok) {
      const errorBody = await fetchRes.text();
      console.error('Alice Blue Trade Book API error:', {
        status: fetchRes.status,
        body: errorBody,
      });
      return NextResponse.json(
        { ok: false, message: `Trade Book API returned ${fetchRes.status}`, details: errorBody },
        { status: fetchRes.status }
      );
    }

    const payload = await fetchRes.json();

    // Normalize the response to match our TradesTable format
    const trades = (Array.isArray(payload?.trades) ? payload.trades : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [])
      .map((trade: any, idx: number) => ({
        id: trade.id || trade.tradeId || `${accountId}-${Date.now()}-${idx}`,
        timestamp: trade.timestamp || trade.time || trade.createdAt || new Date().toISOString(),
        account: accountId || 'Master',
        symbol: trade.symbol || trade.instrument || trade.scrip || trade.scriptName || '',
        type: trade.type || trade.product || 'Market',
        side: trade.side || trade.buySell || trade.transactionType || 'Buy',
        quantity: Number(trade.quantity || trade.qty || 0),
        tradedQty: Number(trade.tradedQty || trade.filledQty || trade.quantity || trade.qty || 0),
        price: Number(trade.price || trade.rate || trade.fillPrice || 0),
        status: trade.status || 'Filled',
      }));

    return NextResponse.json({
      ok: true,
      trades,
      count: trades.length,
      source: 'alice-blue-api',
      accountId,
    });
  } catch (err: any) {
    console.error('Failed to fetch trade book:', err);
    return NextResponse.json(
      { ok: false, message: err?.message || 'Failed to fetch trade book' },
      { status: 500 }
    );
  }
}
