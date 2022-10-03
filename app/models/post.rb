class Post < ApplicationRecord
    validates :body, :channel_id, :author_id, presence: true

    belongs_to :author,
        class_name: :User,
        primary_key: :id,
        foreign_key: :author_id

    belongs_to :parent, optional: true,
        class_name: :Post,
        primary_key: :id,
        foreign_key: :parent_id

    belongs_to :channel

    def created_at
        attributes['created_at'].strftime("%m/%d/%Y")
    end
end
