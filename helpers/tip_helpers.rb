module TipHelpers
  def tip
    @tip ||= data.tips.find { |t| t.id.to_s == current_page.data.tip_id.to_s }
  end
end
