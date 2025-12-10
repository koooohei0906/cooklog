class CookingRecord < ApplicationRecord
  belongs_to :user

  validates :cooked_on, presence: { message: "日付を入力してください" }
  validates :dish_name, presence: { message: "料理名を入力してください" }
  validates :recipe_url, allow_blank: true, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), message: "有効なURLを入力してください" }
  validates :memo, length: { maximum: 255, message: "255文字以内で入力してください" }
end
