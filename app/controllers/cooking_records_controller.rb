class CookingRecordsController < ApplicationController
  before_action :authenticate_user!

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
    @cooking_records = CookingRecord.includes(:user)
  end

  private

  def cooking_record_params
    params.require(:cooking_record).permit(:cooked_on, :dish_name, :recipe_url, :memo)
  end
end
