class AddIndexToServerUser < ActiveRecord::Migration[7.0]
  def change
    add_index :server_users, [:user_id, :server_id], unique: true
    add_index :channel_users, [:user_id, :channel_id], unique: true
  end
end
