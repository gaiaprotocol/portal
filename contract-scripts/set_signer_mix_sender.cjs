require("@nomiclabs/hardhat-ethers");

async function main() {
  //const mixSenderAddress = "0xDeE2b8539c2321450a99f6728633DEf8d069262F"; // klaytn
  //const mixSenderAddress = "0x5DB69B9f173f9D9FA91b7cDCc4Dc9939C0499CFe"; // eth
  const mixSenderAddress = "0x5085a6879Af6767732c51CA0fc7422d41d9aAEf6"; // polygon

  const newSigner = "0x04977f55aAdf5B24a1d7C5a2bB5bC8988572d578";

  const MixSender = await ethers.getContractFactory("MixSender");
  const mixSender = await MixSender.attach(mixSenderAddress);

  console.log("Setting signer: ", newSigner, " owner: " + await mixSender.owner());

  const tx = await mixSender.setSigner(newSigner);
  await tx.wait();

  console.log("Signer set to:", newSigner);
  process.exit();
}

main();
