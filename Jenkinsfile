pipeline {
    agent any

    environment {
        RUNNER_CONTAINER = 'qa-playwright-runner'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Results') {
            steps {
                sh '''
                    rm -rf results
                    mkdir -p results/raw results/processed results/evidence
                '''
            }
        }

        stage('Build Playwright Runner') {
            steps {
                sh 'docker-compose build qa-playwright'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh '''
                    docker rm -f ${RUNNER_CONTAINER} || true

                    docker-compose run --name ${RUNNER_CONTAINER} qa-playwright bash scripts/run/run-tests.sh
                '''
            }
        }

        stage('Collect Results') {
            steps {
                sh '''
                    docker cp ${RUNNER_CONTAINER}:/app/results/raw ./results/
                    
                    if docker exec ${RUNNER_CONTAINER} test -d /app/results/evidence; then
                      docker cp ${RUNNER_CONTAINER}:/app/results/evidence ./results/ || true
                    fi

                    if docker exec ${RUNNER_CONTAINER} test -d /app/test-results; then
                      mkdir -p test-results
                      docker cp ${RUNNER_CONTAINER}:/app/test-results/. ./test-results/ || true
                    fi
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'results/raw/junit.xml'
            archiveArtifacts artifacts: 'results/**/*, test-results/**/*', allowEmptyArchive: true
            sh 'docker rm -f ${RUNNER_CONTAINER} || true'
        }
    }
}