class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.string :body, null: false
      t.integer :channel_id, null: false
      t.integer :author_id, null: false
      t.integer :parent_id, null: false

      t.timestamps
    end
  end
end
