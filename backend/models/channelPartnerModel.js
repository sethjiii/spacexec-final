const {mongoose}=require("mongoose")


const channelPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    is_admin_approoved:{
      type:Boolean,
      default:false,
    },
    user_identity:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model who created the channel partner
        required: false,
    },
    mobile: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model who created the channel partner
      required: false,
    },
    usersAddedByPartner: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Array of User IDs added by this channel partner
      },
    ],
  },
  { timestamps: true }
);


module.exports=mongoose.model("ChannelPartner", channelPartnerSchema);