const crypto = require('crypto');

function verifyTokenSignature({ tokenId, userId, propertyId, signature }) {
    // Ensure issuedAt is always a UNIX timestamp

    const metadata = { tokenId, owner: userId, propertyId };
    console.log(metadata)

    const expectedSignature = crypto.createHash('sha256').update(JSON.stringify(metadata)).digest('hex');

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", signature);

    return expectedSignature === signature;
}

module.exports = verifyTokenSignature;
