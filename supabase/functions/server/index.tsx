import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-0dc2674a/health", (c) => {
  return c.json({ status: "ok" });
});

// User data endpoints

// Get user balance
app.get("/make-server-0dc2674a/user/:userId/balance", async (c) => {
  try {
    const userId = c.req.param("userId");
    const balance = await kv.get(`user:${userId}:balance`);
    return c.json({ balance: balance || 0 });
  } catch (error) {
    console.log(`Error getting balance: ${error}`);
    return c.json({ error: "Failed to get balance" }, 500);
  }
});

// Update user balance
app.post("/make-server-0dc2674a/user/:userId/balance", async (c) => {
  try {
    const userId = c.req.param("userId");
    const { balance } = await c.req.json();
    await kv.set(`user:${userId}:balance`, balance);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error updating balance: ${error}`);
    return c.json({ error: "Failed to update balance" }, 500);
  }
});

// Get user stats
app.get("/make-server-0dc2674a/user/:userId/stats", async (c) => {
  try {
    const userId = c.req.param("userId");
    const stats = await kv.get(`user:${userId}:stats`);
    return c.json(stats || { games: 0, wins: 0, maxMultiplier: 0, totalBet: 0 });
  } catch (error) {
    console.log(`Error getting stats: ${error}`);
    return c.json({ error: "Failed to get stats" }, 500);
  }
});

// Update user stats
app.post("/make-server-0dc2674a/user/:userId/stats", async (c) => {
  try {
    const userId = c.req.param("userId");
    const stats = await c.req.json();
    await kv.set(`user:${userId}:stats`, stats);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error updating stats: ${error}`);
    return c.json({ error: "Failed to update stats" }, 500);
  }
});

// Get user history
app.get("/make-server-0dc2674a/user/:userId/history", async (c) => {
  try {
    const userId = c.req.param("userId");
    const history = await kv.get(`user:${userId}:history`);
    return c.json(history || []);
  } catch (error) {
    console.log(`Error getting history: ${error}`);
    return c.json({ error: "Failed to get history" }, 500);
  }
});

// Add to user history
app.post("/make-server-0dc2674a/user/:userId/history", async (c) => {
  try {
    const userId = c.req.param("userId");
    const newItem = await c.req.json();
    const history = await kv.get(`user:${userId}:history`) || [];
    history.unshift(newItem);
    // Keep only last 100 items
    const trimmedHistory = history.slice(0, 100);
    await kv.set(`user:${userId}:history`, trimmedHistory);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error adding to history: ${error}`);
    return c.json({ error: "Failed to add to history" }, 500);
  }
});

// Place bet
app.post("/make-server-0dc2674a/bet/place", async (c) => {
  try {
    const { userId, amount, game, data } = await c.req.json();

    // Get current balance
    const balance = await kv.get(`user:${userId}:balance`) || 0;

    if (balance < amount) {
      return c.json({ success: false, error: "Insufficient balance" }, 400);
    }

    // Deduct balance
    await kv.set(`user:${userId}:balance`, balance - amount);

    const betId = `${userId}_${Date.now()}`;

    return c.json({ success: true, betId });
  } catch (error) {
    console.log(`Error placing bet: ${error}`);
    return c.json({ error: "Failed to place bet" }, 500);
  }
});

// Cashout
app.post("/make-server-0dc2674a/bet/cashout", async (c) => {
  try {
    const { userId, betId, winAmount } = await c.req.json();

    // Get current balance
    const balance = await kv.get(`user:${userId}:balance`) || 0;

    // Add winnings
    await kv.set(`user:${userId}:balance`, balance + winAmount);

    return c.json({ success: true, win: winAmount });
  } catch (error) {
    console.log(`Error during cashout: ${error}`);
    return c.json({ error: "Failed to cashout" }, 500);
  }
});

// Top up with Stars
app.post("/make-server-0dc2674a/topup/stars", async (c) => {
  try {
    const { userId, amount } = await c.req.json();

    // Get current balance
    const balance = await kv.get(`user:${userId}:balance`) || 0;

    // Add amount
    await kv.set(`user:${userId}:balance`, balance + amount);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error topping up with Stars: ${error}`);
    return c.json({ error: "Failed to top up" }, 500);
  }
});

// Top up with TON
app.post("/make-server-0dc2674a/topup/ton", async (c) => {
  try {
    const { userId, amount } = await c.req.json();

    // In real implementation, this would verify TON payment
    // For now, just return success

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error topping up with TON: ${error}`);
    return c.json({ error: "Failed to top up" }, 500);
  }
});

// Get all users (for admin)
app.get("/make-server-0dc2674a/admin/users", async (c) => {
  try {
    const balances = await kv.getByPrefix("user:");
    const users = [];

    // Parse user data from keys
    const userIds = new Set();
    for (const item of balances) {
      const match = item.key?.match(/user:(\d+):/);
      if (match) {
        userIds.add(match[1]);
      }
    }

    for (const userId of userIds) {
      const balance = await kv.get(`user:${userId}:balance`) || 0;
      const stats = await kv.get(`user:${userId}:stats`) || { games: 0, wins: 0, maxMultiplier: 0, totalBet: 0 };
      users.push({ userId, balance, stats });
    }

    return c.json(users);
  } catch (error) {
    console.log(`Error getting users: ${error}`);
    return c.json({ error: "Failed to get users" }, 500);
  }
});

// Get all history (for admin)
app.get("/make-server-0dc2674a/admin/history", async (c) => {
  try {
    const balances = await kv.getByPrefix("user:");
    let allHistory: any[] = [];

    const userIds = new Set();
    for (const item of balances) {
      const match = item.key?.match(/user:(\d+):/);
      if (match) {
        userIds.add(match[1]);
      }
    }

    for (const userId of userIds) {
      const history = await kv.get(`user:${userId}:history`) || [];
      const historyWithUser = history.map((h: any) => ({ ...h, userId }));
      allHistory = allHistory.concat(historyWithUser);
    }
    
    // Sort by most recent (assuming simple order, or by parsing date)
    // For now we just return them all
    return c.json(allHistory);
  } catch (error) {
    console.log(`Error getting admin history: ${error}`);
    return c.json({ error: "Failed to get admin history" }, 500);
  }
});

// Game Control Endpoints
app.post("/make-server-0dc2674a/admin/next-crash", async (c) => {
  try {
    const { multiplier } = await c.req.json();
    await kv.set('global:next_crash', Number(multiplier));
    return c.json({ success: true, multiplier });
  } catch (error) {
    console.log(`Error setting next crash: ${error}`);
    return c.json({ error: "Failed to set next crash" }, 500);
  }
});

app.get("/make-server-0dc2674a/game/crash-point", async (c) => {
  try {
    // Check if admin has set a forced crash point
    const forcedCrash = await kv.get('global:next_crash');
    if (forcedCrash) {
      // Clear it after using it once
      await kv.del('global:next_crash');
      return c.json({ crashPoint: Number(forcedCrash), forced: true });
    }
    
    // Otherwise, generate normal random crash point
    const e = 100 / (100 - Math.random() * 100);
    const result = Math.max(1.00, Math.floor(e * 100) / 100);
    const crashPoint = result > 1000 ? 1000 : result;
    
    return c.json({ crashPoint, forced: false });
  } catch (error) {
    console.log(`Error getting crash point: ${error}`);
    return c.json({ error: "Failed to get crash point" }, 500);
  }
});

Deno.serve(app.fetch);