require("@nomiclabs/hardhat-ethers");

async function main() {
  //const injeolmiSenderAddress = "0x19f112c05Fad52e5C58E5A4628548aBB45bc8697"; // klaytn
  //const injeolmiSenderAddress = "0xBeA76c71929788Ab20e17759eaC115798F9aEf27"; // eth
  //const injeolmiSenderAddress = "0x9b23804ede399ebf86612b560Ac0451f1448185a"; // polygon
  const injeolmiSenderAddress = "0xf258F061aE2D68d023eA6e7Cceef97962785c6c1"; // bnb

  const newSigner = "0x04977f55aAdf5B24a1d7C5a2bB5bC8988572d578";

  const InjeolmiSender = await ethers.getContractFactory("InjeolmiSender");
  const injeolmiSender = await InjeolmiSender.attach(injeolmiSenderAddress);

  console.log("Setting signer: ", newSigner, " owner: " + await injeolmiSender.owner());

  const tx = await injeolmiSender.setSigner(newSigner);
  await tx.wait();

  console.log("Signer set to:", newSigner);
  process.exit();
}

main();
