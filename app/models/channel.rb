class Channel < ApplicationRecord
    validates :name, :server_id, presence: true

    belongs_to :server
    has_many :posts
    has_many :channel_users
    has_many :users, through: :channel_users
end
