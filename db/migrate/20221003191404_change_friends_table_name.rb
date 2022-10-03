class ChangeFriendsTableName < ActiveRecord::Migration[7.0]
  def change
    rename_table :friends, :user_friends
  end
end
