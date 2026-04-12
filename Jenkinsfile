pipeline {
    agent any

      stages {
         stage('Checkout') {
             steps {
                checkout scm
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                sh 'docker-compose run --rm qa-playwright bash scripts/run/run-tests.sh' 
                
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'results/raw/junit.xml'
            archiveArtifacts artifacts: 'results/**/*', allowEmptyArchive: true
        }
    }
}