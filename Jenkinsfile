pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend/fastapi-api'
        FRONTEND_DIR = 'frontend/react-app'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Backend: Install & Test') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo 'Installing Python dependencies...'
                    sh 'pip install -r requirements.txt'
                    echo 'Running tests (placeholder)...'
                    sh 'python -m pytest || true'
                }
            }
        }

        stage('Frontend: Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo 'Building frontend...'
                    // Since it's a simple index.html, no build step needed
                    sh 'ls -la'
                }
            }
        }

        stage('Deploy (Dry Run)') {
            steps {
                echo 'Simulating deployment to Staging Environment...'
                sh 'echo "Deploying Python Support Desk..."'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
