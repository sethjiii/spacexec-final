const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

function generateToken(tokenId,userId, propertyId) {
    if(!tokenId){
        tokenId = uuidv4();
    }
    // Correct metadata structure
    const metadata = { tokenId, owner: userId, propertyId};

    console.log("Metadata:", metadata);  // Debugging

    // Generate signature
    const signature = crypto.createHash('sha256').update(JSON.stringify(metadata)).digest('hex');

    return { ...metadata, signature };
}

module.exports = generateToken;
