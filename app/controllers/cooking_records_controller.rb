class CookingRecordsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cooking_record, only: %i[ show edit update destroy destroy_photo ]

  def new
    @cooking_record = CookingRecord.new
  end

  def create
    @cooking_record = current_user.cooking_records.new(cooking_record_params)

    if @cooking_record.save
      enqueue_photo_variants(@cooking_record)
      redirect_to dashboard_path, notice: "料理記録を登録しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def index
    @cooking_records = current_user.cooking_records.order(cooked_on: :desc, created_at: :desc)
  end

  def show; end

  def edit; end

  def update
    if @cooking_record.update(cooking_record_params)
      enqueue_photo_variants(@cooking_record)
      redirect_to @cooking_record, notice: "料理記録を更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @cooking_record.destroy
    redirect_to cooking_records_path, notice: "料理記録を削除しました"
  end

  def destroy_photo
    @cooking_record.photo.purge if @cooking_record.photo.attached?
    redirect_to edit_cooking_record_path(@cooking_record), notice: "画像を削除しました"
  end

  private

  def cooking_record_params
    params.require(:cooking_record).permit(:cooked_on, :dish_name, :recipe_url, :memo, :photo)
  end

  def set_cooking_record
    @cooking_record = current_user.cooking_records.find(params[:id])
  end

  def enqueue_photo_variants(record)
    CookingRecordPhotoVariantsJob.perform_later(record.id) if record.photo.attached?
  end
end
