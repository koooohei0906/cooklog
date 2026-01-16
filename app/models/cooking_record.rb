class CookingRecord < ApplicationRecord
  belongs_to :user

  validates :cooked_on, presence: { message: "日付を入力してください" }
  validates :dish_name, presence: { message: "料理名を入力してください" }
  validates :recipe_url, allow_blank: true, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), message: "有効なURLを入力してください" }
  validates :memo, length: { maximum: 255, message: "255文字以内で入力してください" }

  has_one_attached :photo
  has_one_attached :thumb

  validate :photo_content_type_and_size

  private

  def photo_content_type_and_size
    return unless photo.attached?
    # サイズのバリデーション
    if photo.blob.byte_size > 10.megabytes
      errors.add(:photo, "は10MB未満にしてください")
    end

    # 形式のバリデーション
    allowed = %w[ image/jpeg image/heic image/heif ]

    unless allowed.include?(photo.blob.content_type)
      errors.add(:photo, "はJPEGまたはHEIC/HEIF形式のみ対応しています")
    end
  end
end
