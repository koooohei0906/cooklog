class CookingRecord < ApplicationRecord
  belongs_to :user

  # バリデーション
  validates :dish_name, presence: true
  validates :cooked_on, presence: true
end
