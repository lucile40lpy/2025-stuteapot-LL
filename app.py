from flask import Flask, render_template, url_for, request, redirect, flash, send_from_directory
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Needed for flash messages

# Within dev folder routes
@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('static/images', filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('static/css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('static/js', filename)

@app.context_processor
def inject_static_images():
    """Inject static image URLs into all templates"""
    return {
        'static_images': {
            'teapot': url_for('static', filename='images/teapot_straight_t.png'),
            'nappe': url_for('static', filename='images/nappe2.jpeg'),
            'teacup': url_for('static', filename='images/filled_teacup_t.png')
        }
    }

# Website routes
@app.route('/')
def home():
    return render_template('stuteapot_home.html')

@app.route('/start_test')
def start_test():
    return render_template('stuteapot_start-test.html')

@app.route('/take_test_en')
def take_test_en():
    return render_template('stuteapot_test_en.html')

@app.route('/take_test_fr')
def take_test_fr():
    return render_template('stuteapot_test_fr.html')

@app.route('/results_en')
def results_en():
    # This route can display results directly if needed
    return render_template('stuteapot_results_en.html')

def calculate_learning_style_scores(form_data):
    """Calculate learning style scores based on ILS form data"""
    # Convert Likert scale values (1-5) to percentages (0-100%)
    def normalize_score(value):
        if value is None:
            return 0
        return ((int(value) - 1) / 4) * 100

    # Meaning-oriented: act1, act2, act6, act7, mot1, mot6
    meaning_vars = ['ils_act1', 'ils_act2', 'ils_act6', 'ils_act7', 'ils_mot1', 'ils_mot6']
    meaning_scores = [normalize_score(form_data.get(var)) for var in meaning_vars if form_data.get(var) is not None]
    meaning_score = sum(meaning_scores) / len(meaning_scores) if meaning_scores else 0

    # Reproduction-oriented: act3, act4, act8, act9, mot2, mot7
    reproduction_vars = ['ils_act3', 'ils_act4', 'ils_act8', 'ils_act9', 'ils_mot2', 'ils_mot7']
    reproduction_scores = [normalize_score(form_data.get(var)) for var in reproduction_vars if form_data.get(var) is not None]
    reproduction_score = sum(reproduction_scores) / len(reproduction_scores) if reproduction_scores else 0

    # Application-oriented: act5, mot3, mot7, mot9
    application_vars = ['ils_act5', 'ils_mot3', 'ils_mot7', 'ils_mot9']
    application_scores = [normalize_score(form_data.get(var)) for var in application_vars if form_data.get(var) is not None]
    application_score = sum(application_scores) / len(application_scores) if application_scores else 0

    # Undirected: act10, mot4, mot5, mot10, mot8
    undirected_vars = ['ils_act10', 'ils_mot4', 'ils_mot5', 'ils_mot10', 'ils_mot8']
    undirected_scores = [normalize_score(form_data.get(var)) for var in undirected_vars if form_data.get(var) is not None]
    undirected_score = sum(undirected_scores) / len(undirected_scores) if undirected_scores else 0

    return {
        'meaning': round(meaning_score),
        'reproduction': round(reproduction_score),
        'application': round(application_score),
        'undirected': round(undirected_score)
    }

def get_main_learning_style(scores):
    """Determine the main learning style based on scores"""
    styles = [
        {'name': 'Meaning-Oriented', 'score': scores['meaning']},
        {'name': 'Reproduction-Oriented', 'score': scores['reproduction']},
        {'name': 'Application-Oriented', 'score': scores['application']},
        {'name': 'Undirected', 'score': scores['undirected']}
    ]
    
    main_style = max(styles, key=lambda x: x['score'])
    return main_style['name']

@app.route('/submit_test', methods=['POST'])
def submit_test():
    try:
        # Collect all form data
        form_data = {
            'timestamp': datetime.now().isoformat(),
            'anonymous_id': request.form.get('anonymous-id'),
            'gender': request.form.get('gender'),
            'age': request.form.get('age'),
            'economic_situation': request.form.get('economic-situation'),
            'class_year': request.form.get('class-year'),
            'study_field': request.form.get('study-field'),
            'grades': request.form.get('grades'),
            'self_confidence': request.form.get('self-confidence'),
            'stress': request.form.get('stress'),
            'well_being': request.form.get('well-being'),
            'knowledge_durability': request.form.get('knowledge-durability'),
            'cheating': request.form.get('cheating'),
            
            # FFM data
            'ffm1': request.form.get('ffm1'),
            'ffm2': request.form.get('ffm2'),
            'ffm3': request.form.get('ffm3'),
            'ffm4': request.form.get('ffm4'),
            'ffm5': request.form.get('ffm5'),
            'ffm6': request.form.get('ffm6'),
            'ffm7': request.form.get('ffm7'),
            'ffm8': request.form.get('ffm8'),
            'ffm9': request.form.get('ffm9'),
            'ffm10': request.form.get('ffm10'),
            
            # ILS Activities data
            'ils_act1': request.form.get('ils-act1'),
            'ils_act2': request.form.get('ils-act2'),
            'ils_act3': request.form.get('ils-act3'),
            'ils_act4': request.form.get('ils-act4'),
            'ils_act5': request.form.get('ils-act5'),
            'ils_act6': request.form.get('ils-act6'),
            'ils_act7': request.form.get('ils-act7'),
            'ils_act8': request.form.get('ils-act8'),
            'ils_act9': request.form.get('ils-act9'),
            'ils_act10': request.form.get('ils-act10'),
            
            # ILS Motives data
            'ils_mot1': request.form.get('ils-mot1'),
            'ils_mot2': request.form.get('ils-mot2'),
            'ils_mot3': request.form.get('ils-mot3'),
            'ils_mot4': request.form.get('ils-mot4'),
            'ils_mot5': request.form.get('ils-mot5'),
            'ils_mot6': request.form.get('ils-mot6'),
            'ils_mot7': request.form.get('ils-mot7'),
            'ils_mot8': request.form.get('ils-mot8'),
            'ils_mot9': request.form.get('ils-mot9'),
            'ils_mot10': request.form.get('ils-mot10'),
            
            # Pedagogy methods
            'pedagogy_lecture_like': request.form.get('pedagogy-lecture-like'),
            'pedagogy_lecture_learn': request.form.get('pedagogy-lecture-learn'),
            'pedagogy_interactive_lecture_like': request.form.get('pedagogy-interactive-lecture-like'),
            'pedagogy_interactive_lecture_learn': request.form.get('pedagogy-interactive-lecture-learn'),
            'pedagogy_directed_discussion_like': request.form.get('pedagogy-directed-discussion-like'),
            'pedagogy_directed_discussion_learn': request.form.get('pedagogy-directed-discussion-learn'),
            'pedagogy_classroom_assessment_like': request.form.get('pedagogy-classroom-assessment-like'),
            'pedagogy_classroom_assessment_learn': request.form.get('pedagogy-classroom-assessment-learn'),
            'pedagogy_group_work_like': request.form.get('pedagogy-group-work-like'),
            'pedagogy_group_work_learn': request.form.get('pedagogy-group-work-learn'),
            'pedagogy_student_peer_feedback_like': request.form.get('pedagogy-student-peer-feedback-like'),
            'pedagogy_student_peer_feedback_learn': request.form.get('pedagogy-student-peer-feedback-learn'),
            'pedagogy_cookbook_labs_like': request.form.get('pedagogy-cookbook-labs-like'),
            'pedagogy_cookbook_labs_learn': request.form.get('pedagogy-cookbook-labs-learn'),
            'pedagogy_just_in_time_like': request.form.get('pedagogy-just-in-time-like'),
            'pedagogy_just_in_time_learn': request.form.get('pedagogy-just-in-time-learn'),
            'pedagogy_case_method_like': request.form.get('pedagogy-case-method-like'),
            'pedagogy_case_method_learn': request.form.get('pedagogy-case-method-learn'),
            'pedagogy_inquiry_based_like': request.form.get('pedagogy-inquiry-based-like'),
            'pedagogy_inquiry_based_learn': request.form.get('pedagogy-inquiry-based-learn'),
            'pedagogy_problem_based_like': request.form.get('pedagogy-problem-based-like'),
            'pedagogy_problem_based_learn': request.form.get('pedagogy-problem-based-learn'),
            'pedagogy_project_based_like': request.form.get('pedagogy-project-based-like'),
            'pedagogy_project_based_learn': request.form.get('pedagogy-project-based-learn'),
            'pedagogy_role_plays_like': request.form.get('pedagogy-role-plays-like'),
            'pedagogy_role_plays_learn': request.form.get('pedagogy-role-plays-learn'),
            'pedagogy_fieldwork_like': request.form.get('pedagogy-fieldwork-like'),
            'pedagogy_fieldwork_learn': request.form.get('pedagogy-fieldwork-learn'),
            
            # Teacher style
            'teaching_style_expert_like': request.form.get('teaching-style-expert-like'),
            'teaching_style_expert_learn': request.form.get('teaching-style-expert-learn'),
            'teaching_style_formal_authority_like': request.form.get('teaching-style-formal-authority-like'),
            'teaching_style_formal_authority_learn': request.form.get('teaching-style-formal-authority-learn'),
            'teaching_style_personal_model_like': request.form.get('teaching-style-personal-model-like'),
            'teaching_style_personal_model_learn': request.form.get('teaching-style-personal-model-learn'),
            'teaching_style_facilitator_like': request.form.get('teaching-style-facilitator-like'),
            'teaching_style_facilitator_learn': request.form.get('teaching-style-facilitator-learn'),
            'teaching_style_delegator_like': request.form.get('teaching-style-delegator-like'),
            'teaching_style_delegator_learn': request.form.get('teaching-style-delegator-learn'),
            
            # Your Input section
            'remarks_admin': request.form.get('remarks-admin'),
            'study_tips': request.form.get('study-tips'),
        }
        
        # Calculate learning style scores
        learning_scores = calculate_learning_style_scores(form_data)
        main_learning_style = get_main_learning_style(learning_scores)
        
        # Here you would typically save the data to a database
        # For now, we'll just print it and show a success message
        print("Form data received:", json.dumps(form_data, indent=2))
        print("Learning style scores:", learning_scores)
        print("Main learning style:", main_learning_style)
        
        # Save to a file (for development)
        with open('test_responses.json', 'a') as f:
            f.write(json.dumps(form_data) + '\n')
        
        # Render the results page with the calculated scores
        return render_template('stuteapot_results_en.html', 
                             learning_scores=learning_scores,
                             main_learning_style=main_learning_style)
        
    except Exception as e:
        print(f"Error processing form: {e}")
        flash('There was an error submitting your test. Please try again.', 'error')
        return redirect(url_for('start_test'))


if __name__ == '__main__':
    app.run(debug=True)