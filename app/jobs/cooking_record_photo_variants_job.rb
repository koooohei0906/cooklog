class CookingRecordPhotoVariantsJob < ApplicationJob
  queue_as :default

  # サムネサイズ
  THUMB_SIZE = 240
  

  def perform(cooking_record_id)
    record = CookingRecord.find_by(id: cooking_record_id)
    return unless record && record.photo.attached?

    # libvipsで加工するために元画像を一時ファイルとして開き、一時ファイルなのでブロックを渡す
    record.photo.open do |file|
      # 加工した画像ファイルがprocessed.pathで取れるようになる
      processed = ImageProcessing::Vips.source(file.path).resize_to_fill(THUMB_SIZE, THUMB_SIZE).convert("webp").call

      # 加工ファイルをthumbとして保存する、Rails公式ドキュメント通り
      record.thumb.attach(io: File.open(processed.path), filename: "thumb-#{record.photo.filename.base}.webp", content_type: "image/webp")

      # ここまでの処理の成功/失敗に関わらず一時ファイルを削除する
      # 「&.」はnilなら何もしない、の意
    ensure
      processed&.close!
    end
  end
end
