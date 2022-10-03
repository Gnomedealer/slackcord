class RemoveNullFromPost < ActiveRecord::Migration[7.0]
  def change
    change_column_null :posts, :parent_id, true
  end
end
