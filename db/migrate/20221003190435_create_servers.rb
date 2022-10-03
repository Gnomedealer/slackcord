class CreateServers < ActiveRecord::Migration[7.0]
  def change
    create_table :servers do |t|
      t.string :name, null: false
      t.integer :owner_id, null: false

      t.timestamps
    end
  end
end
