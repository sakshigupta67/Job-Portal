console.log("Webhook received!");


export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

const evt = wh.verify(JSON.stringify(req.body), {
  "svix-id": req.headers["svix-id"],
  "svix-timestamp": req.headers["svix-timestamp"],
  "svix-signature": req.headers["svix-signature"],
});


    const { data, type } = evt;

    switch (type) {
  case "user.created": {

  const primaryEmail = data.email_addresses.find(
    email => email.id === data.primary_email_address_id
  );

  await User.create({
    _id: data.id,
    email: primaryEmail?.email_address || "",
    name: `${data.first_name || ""} ${data.last_name || ""}`,
    image: data.image_url || "",
    resume: "",
  });

  break;
}


      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false });
  }

  console.log("Connected DB:", mongoose.connection.name)

}
