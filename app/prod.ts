import BlockchainType from "./blockchain/BlockchainType.js";
import initialize from "./initialize.js";

await initialize({
  dev: true,

  supabaseUrl: "https://pgscerhsabxdiivxgqwu.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnc2NlcmhzYWJ4ZGlpdnhncXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0Njg4NzgsImV4cCI6MjAxOTA0NDg3OH0.bqbII5tL9K1IQeV05887oylSaTxjIUEGAOxGQuEMrZo",

  walletConnectProjectId: "0ab785b21622796d65bc8114214f4cb8",
  infuraKey: "61f85925d0204a4da353c23bc0d90182",

  contracts: {
    gaiaBridgeFeeDb: {
      [BlockchainType.Ethereum]: "0x38f5Bc161F5E1cBa86d82D5f0B11EA4ad40f07C7",
      [BlockchainType.Polygon]: "0xe7b16698ffe31B453F544Ee57063f60e4F94C8d8",
      [BlockchainType.BNB]: "0xd1a4964954785ddbC8C86a5412cE400f6E8d81D3",
      [BlockchainType.Klaytn]: "0xC53a3cB3d40d96C5f83A019C6D67B587927C62B7",
      [BlockchainType.Bifrost]: "0xd1a4964954785ddbC8C86a5412cE400f6E8d81D3",
    },
    gaiaBridge: {
      [BlockchainType.Ethereum]: "0x2D28272eBfB04f21A675E9955Df09507C6b28b25",
      [BlockchainType.Polygon]: "0x8213c697F6EF3477ee33ebcaFC092c591679c24c",
      [BlockchainType.BNB]: "0x9f69C2a06c97fCAAc1E586b30Ea681c43975F052",
      [BlockchainType.Klaytn]: "0xAdb91C905e792769760034d5607FbBC255A79333",
      [BlockchainType.Bifrost]: "0x9f69C2a06c97fCAAc1E586b30Ea681c43975F052",
    },
  },
});
