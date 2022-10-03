class CreateChannelUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :channel_users do |t|
      t.integer :user_id, null: false
      t.integer :channel_id, null: false
      t.timestamps
    end
  end
end
