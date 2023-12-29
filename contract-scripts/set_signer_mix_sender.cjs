require("@nomiclabs/hardhat-ethers");

async function main() {
  const mixSenderAddress = "0x5DB69B9f173f9D9FA91b7cDCc4Dc9939C0499CFe";
  const newSigner = "0x04977f55aAdf5B24a1d7C5a2bB5bC8988572d578";

  const MixSender = await ethers.getContractFactory("MixSender");
  const mixSender = await MixSender.attach(mixSenderAddress);

  console.log("Setting signer: ", newSigner);

  const tx = await mixSender.setSigner(newSigner);
  await tx.wait();

  console.log("Signer set to:", newSigner);
}

main();
