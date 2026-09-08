import type { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest
) {
  const cronSecret =
    process.env.CRON_SECRET;

  const authorization =
    request.headers.get("authorization");

  if (
    !cronSecret ||
    authorization !== `Bearer ${cronSecret}`
  ) {
    return Response.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const supabase =
      await createClient();

    /*
     * Query thật vào Supabase Database.
     * Không thay đổi dữ liệu.
     */
    const { data, error } =
      await supabase
        .from("albums")
        .select("id")
        .eq("is_published", true)
        .limit(1);

    if (error) {
      console.error(
        "Supabase keepalive error:",
        error
      );

      return Response.json(
        {
          ok: false,
          message:
            "Supabase database query failed",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      ok: true,
      database: "connected",
      albumsFound: data?.length ?? 0,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "Keepalive error:",
      error
    );

    return Response.json(
      {
        ok: false,
        message:
          "Unexpected keepalive error",
      },
      {
        status: 500,
      }
    );
  }
}