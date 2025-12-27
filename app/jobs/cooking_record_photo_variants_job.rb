class CookingRecordPhotoVariantsJob < ApplicationJob
  queue_as :default

  def perform(cooking_record_id)
    record = CookingRecord.find_by(id: cooking_record_id)
    return unless record && record.photo.attached?

    # 一覧用のサムネを事前生成！
    record.photo_thumb.processed
  end
end
