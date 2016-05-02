module ProblemHelpers
  def problem
    @problem ||= data.problems.find { |p| p.id.to_s == current_page.data.problem_id.to_s }
  end

  def show_problem
    "#{problem.title}: #{problem.name}"
  end
end
