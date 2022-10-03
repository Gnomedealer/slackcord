class CreateServerUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :server_users do |t|
      t.integer :user_id, null: false
      t.integer :server_id, null: false

      t.timestamps
  end
  end
end
