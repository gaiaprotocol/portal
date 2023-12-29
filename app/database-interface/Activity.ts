export default interface Activity {
  asset: string;
  from_chain_id: number;
  sender: string;
  sending_id: bigint;
  to_chain_id: number;
  receiver: string;
  amount_data: string;
  send_tx?: string;
  receive_tx?: string;
  created_at: string;
  updated_at?: string;
}
