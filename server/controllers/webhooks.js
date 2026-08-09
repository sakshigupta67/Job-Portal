import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  console.log("🔥 WEBHOOK RECEIVED");

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const svixHeaders = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Because we use express.raw() in server.js
    const payload = req.body.toString();

    const evt = wh.verify(payload, svixHeaders);

    console.log("✅ Webhook verified");
    console.log("Event type:", evt.type);

    const { id } = evt.data;

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const userData = {
          _id: id,
          email: evt.data.email_addresses?.[0]?.email_address || "",
          name: `${evt.data.first_name || ""} ${
            evt.data.last_name || ""
          }`.trim(),
          image: evt.data.image_url || "",
        };

        const user = await User.findOneAndUpdate(
          { _id: id },
          userData,
          {
            new: true,
            upsert: true,
          }
        );

        console.log("✅ User saved to MongoDB:", user);

        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(id);

        console.log("🗑️ User deleted:", id);

        break;
      }

      default:
        console.log("🚫Unhandled event:", evt.type);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};