class CreateChannels < ActiveRecord::Migration[7.0]
  def change
    create_table :channels do |t|
      t.string :name, null: false
      t.integer :server_id, null: false
      t.boolean :private, null: false

      t.timestamps
    end
  end
end
