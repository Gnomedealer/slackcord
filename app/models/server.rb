class Server < ApplicationRecord
    validates :name, :owner_id, presence: true

    belongs_to :owner,
        class_name: :User,
        foreign_key: :owner_id
    has_many :server_users
    has_many :users, through: :server_users
    has_many :channels
end
