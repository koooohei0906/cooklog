class CookingRecordsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cooking_record, only: %i[ show edit update destroy ]

  def new
    @cooking_record = CookingRecord.new
  end

  def create
    @cooking_record = current_user.cooking_records.new(cooking_record_params)

    if @cooking_record.save
      redirect_to root_path, notice: "料理記録を登録しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def index
    @cooking_records = CookingRecord.includes(:user).order(cooked_on: :desc)
  end

  def show; end

  def edit; end

  def update
    if @cooking_record.update(cooking_record_params)
      redirect_to @cooking_record, notice: "料理記録を編集しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @cooking_record.destroy
    redirect_to cooking_records_path, notice: "料理記録を削除しました"
  end

  private

  def cooking_record_params
    params.require(:cooking_record).permit(:cooked_on, :dish_name, :recipe_url, :memo)
  end

  def set_cooking_record
    @cooking_record = current_user.cooking_records.find(params[:id])
  end
end
