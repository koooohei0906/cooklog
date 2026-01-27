class PagesController < ApplicationController
  def home
    redirect_to dashboard_path if user_signed_in?
  end

  def new_guest
    user = User.find_or_create_by(email: 'guest@example.com') do |user|
      user.name = "ゲスト"
      user.password = SecureRandom.urlsafe_base64
    end
    sign_in user
    redirect_to dashboard_path, notice: "ゲストユーザーとしてログインしました。"
  end
end
