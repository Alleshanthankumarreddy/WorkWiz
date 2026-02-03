import CustomerProfile from "../Models/CustomerProfileModel.js";

const createCustomerProfile= async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { street, city, state, pincode } = address;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Complete address is required",
      });
    }

    const userId = req.user._id;

    let profile = await CustomerProfile.findOne({ userId });

    if (profile) {
      profile.name = name;
      profile.phone = phone;
      profile.address = { street, city, state, pincode };

      await profile.save();

      return res.status(200).json({
        success: true,
        message: "Customer profile updated successfully",
        profile,
      });
    }

    profile = await CustomerProfile.create({
      userId,
      name,
      phone,
      address: { street, city, state, pincode },
    });

    res.status(201).json({
      success: true,
      message: "Customer profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Error saving customer profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await CustomerProfile.findOne({ userId }).populate(
      "userId",
      "email"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, address } = req.body;

    const profile = await CustomerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    // ✅ Update only fields that are provided
    if (name) profile.name = name;
    if (phone) profile.phone = phone;

    if (address) {
      if (address.street) profile.address.street = address.street;
      if (address.city) profile.address.city = address.city;
      if (address.state) profile.address.state = address.state;
      if (address.pincode) profile.address.pincode = address.pincode;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Customer profile updated successfully",
      profile,
    });

  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export { getCustomerProfile, createCustomerProfile, updateCustomerProfile }
